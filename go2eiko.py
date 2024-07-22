import sys
import requests
import os
import re
import logging
import argparse
from typing import Union
import glob
import shutil
import stat


# Constants
GO_EXTENSIONS_IMAGES = ['png', 'jpg', 'jpeg']
GO_EXTENSIONS_DATA = ['json']
ED_DATA_EXTENSIONS = ['yml', 'png']
AUTH = None  # TODO: might not be the most secured way to store the credentials
DEFAULT_MASTER_OUTPUT_PATH = "./data/"

# Informations about the repository
GO_OWNER = "frzyc"
GO_REPO = "genshin-optimizer"
ED_OWNER = "eikofee"
ED_REPO = "eikonomiya-data"

# User specific
METHOD = None
MASTER_OUTPUT_PATH = DEFAULT_MASTER_OUTPUT_PATH
TEMP_FOLDER = os.path.join(MASTER_OUTPUT_PATH, "temp")
FORCE = None

# Eikonomiya-data specific
ED_DATA_FOLDERS = ["artifacts", "weapons", "resonances", "assets/generic", "characters"]

def checkout_eikonomiya():
    current_path = os.getcwd()
    temp_folder_path = os.path.join(current_path, TEMP_FOLDER)
    os.makedirs(temp_folder_path, exist_ok=True)
    os.chdir(temp_folder_path)
    logging.info("Cloning Eikonomiya-data ...")
    os.system(f"git clone https://github.com/eikofee/eikonomiya-data.git")
    os.chdir(current_path)


def sparse_checkout(path_to_checkout: str):

    # Get current path
    current_path = os.getcwd()

    # Clone the repository
    temp_folder_path = os.path.join(current_path, TEMP_FOLDER)
    os.makedirs(temp_folder_path, exist_ok=True)
    os.chdir(temp_folder_path)
    logging.info("Sparse cloning Genshin Optimizer ...")
    os.system(f"git clone --filter=blob:none --no-checkout https://github.com/frzyc/genshin-optimizer.git")
    os.chdir("genshin-optimizer")
    os.system(f"git config core.sparseCheckout true")
    os.system(f"echo {path_to_checkout} >> .git/info/sparse-checkout")
    logging.info("Checking out ...")
    os.system("git checkout")
    logging.info("Pulling ...")
    os.system("git pull")

    # Go back to the original folder
    os.chdir(current_path)


def del_temp_folder():

    # Set all files to writeable
    filesGo = glob.glob(os.path.join(TEMP_FOLDER, GO_REPO, ".git", "**", "*"), recursive=True)
    filesEd = glob.glob(os.path.join(TEMP_FOLDER, ED_REPO, ".git", "**", "*"), recursive=True)
    files = []
    if len(filesGo) > 0 :
        files.extend(filesGo)
    if len(filesEd) > 0 :
        files.extend(filesEd)
    for file in files:
        os.chmod(file, stat.S_IWRITE)

    # Delete the folder
    shutil.rmtree(TEMP_FOLDER, GO_REPO)
    shutil.rmtree(TEMP_FOLDER, ED_REPO)


def intex_dot_ts2name_converter(index_dot_ts: str, old_filename: str) -> str:
    
    # Convert the name using the index.ts file
    new_filename = old_filename.split(".")[0]
    ext = old_filename.split(".")[1]
    pattern = r"import ([A-Za-z0-9]+) from '.\/([A-Za-z0-9_]+)\.([a-z]+)'"
    for line in index_dot_ts.split("\n"):
        if re.match(pattern, line):
            new_filename = re.search(pattern, line).group(1)
            ext = re.search(pattern, line).group(3)
            if re.search(pattern, line).group(2) + "." + ext == old_filename:
                break

    # Convert the resulting name to match eikonomiya's convention
    d = {
        "constellation1": "c1",
        "constellation2": "c2",
        "constellation3": "c3",
        "constellation4": "c4",
        "constellation5": "c5",
        "constellation6": "c6",
        "icon": "face",
        "banner": "namecard",
        "skill": "skill",
        "burst": "burst",
        "passive1": "a1",
        "passive2": "a4",
    }
    return f"{d[new_filename]}.{ext}" if new_filename in d else old_filename


def download_folder(
    path: str,
    output_path: Union[str, callable],
    name_converter: callable,
    extensions: list[str]
):
    """
    Download all the files in a folder of a GitHub repository.
    
    Parameters
    ----------
    path : str
        Path of the folder in the repository. Usually it is right after
        "tree/master/" in the repository's URL.
    output_path : Union[str, callable]
        Path of the folder where the files will be saved. Can be a relative
        path or an absolute path. If a callable, it should take a single
        argument corresponding to the name of the file as stored in the
        repository, and return the path of the file as it should be saved.
    name_converter : callable
        The function that converts the name of the file. It should take a
        single argument corresponding to the name of the file as stored in the
        repository, and return the name of the file as it should be saved.
    """

    if METHOD == "checkout":

        # Getting all images of the checked out repo
        images = glob.glob(os.path.join(TEMP_FOLDER, GO_REPO, path, "*"), recursive=False)
        logging.info(f"Found {len(images)} items in " + os.path.join(path, "*"))
        for ii in range(len(images)):
            image = images[ii]
            ext = image.split(".")[-1]
            if ext not in extensions:
                continue

            # Getting the new filename
            old_filename = os.path.basename(image)
            filename = name_converter(old_filename)

            # Getting the path for the current image
            real_output_path = None
            if callable(output_path):
                real_output_path = output_path(old_filename)
            else:
                real_output_path = output_path
            real_output_path = os.path.join(MASTER_OUTPUT_PATH, real_output_path)
            os.makedirs(real_output_path, exist_ok=True)

            # Copy the image to the output folder
            shutil.copy(image, os.path.join(real_output_path, filename))
            logging.info(f"({ii + 1}/{len(images)}) Downloaded {filename}!")

        return

    # Getting all images of the set
    url = f"https://api.github.com/repos/{GO_OWNER}/{GO_REPO}/contents/{path}"
    response = requests.get(url, auth=AUTH)  # TODO: lower the number of requests
    if response.status_code == 200:
        contents = response.json()
        images = [
            file['download_url']
            for file in contents
            if file['type'] == 'file'
            and file['name'].lower().endswith(tuple(extensions))
        ]

        # Downloading all the images
        for ii in range(len(images)):
            image = images[ii]
            response = requests.get(image, auth=AUTH)  # TODO: lower the number of requests
            old_filename = image.split("/")[-1]
            filename = name_converter(old_filename)
            
            real_output_path = None
            if callable(output_path):
                real_output_path = output_path(old_filename)
            else:
                real_output_path = output_path
            
    
            # Create a local folder (if needed)
            logging.info(f"({ii + 1}/{len(images)}) Trying to download {path}...")
            folder_path = os.path.join(MASTER_OUTPUT_PATH, real_output_path)
            os.makedirs(folder_path, exist_ok=True)
            
            # Save the file in the folder
            with open(os.path.join(MASTER_OUTPUT_PATH, real_output_path, filename), 'wb') as f:
                f.write(response.content)
            logging.info(f"({ii + 1}/{len(images)}) Downloaded {filename}! ")

def update_eikonomiya_data():

    if METHOD == "checkout":
        for path in ED_DATA_FOLDERS:
            # Getting all images of the checked out repo
            images = glob.glob(os.path.join(TEMP_FOLDER, ED_REPO, path, "*"), recursive=False)
            logging.info(f"Found {len(images)} items in " + os.path.join(path, "*"))
            for ii in range(len(images)):
                image = images[ii]
                ext = image.split(".")[-1]
                if ext not in ED_DATA_EXTENSIONS:
                    continue

                # Getting the new filename
                old_filename = os.path.basename(image)
                filename = old_filename

                # Getting the path for the current image
                real_output_path = f"data/gamedata/{path}"

                os.makedirs(real_output_path, exist_ok=True)

                # Copy the image to the output folder
                shutil.copy(image, os.path.join(real_output_path, filename))
                logging.info(f"({ii + 1}/{len(images)}) Downloaded {filename}!")

        return

    for path in ED_DATA_FOLDERS:
        url = f"https://api.github.com/repos/{ED_OWNER}/{ED_REPO}/contents/{path}"
        response = requests.get(url, auth=AUTH)  # TODO: lower the number of requests
        if response.status_code == 200:
            contents = response.json()
            files = [
            [file['download_url'], file["path"]]
            for file in contents
            if file['type'] == 'file'
            and file['name'].lower().endswith(tuple(ED_DATA_EXTENSIONS))
        ]
            
            for fi in range(len(files)):
                file = files[fi]
                download_url = file[0]
                file_path = "/".join(file[1].split("/")[:-1])
                response = requests.get(download_url, auth=AUTH)  # TODO: lower the number of requests
                old_filename = download_url.split("/")[-1]
                filename = old_filename
                
                real_output_path = f"gamedata/{file_path}"
                
                # Create a local folder (if needed)
                logging.info(f"({fi + 1}/{len(files)}) Trying to download {path}...")
                folder_path = os.path.join(MASTER_OUTPUT_PATH, real_output_path)
                os.makedirs(folder_path, exist_ok=True)
                
                # Save the file in the folder
                with open(os.path.join(MASTER_OUTPUT_PATH, real_output_path, filename), 'wb') as f:
                    f.write(response.content)
                logging.info(f"({fi + 1}/{len(files)}) Downloaded {filename}!")


def download_recursively(
    path: str,
    output_path: str,
    name_converter: Union[str, callable],
    extensions: list[str],
    force_download: bool = False,
    expected_files: int = 1,
):
    """
    Download all the files in a folder of a GitHub repository recursively. In
    fact, this function is NOT really recursive, but will only download the
    files in the first level of the given folder.

    Parameters
    ----------
    path : str
        Path of the folder in the repository. Usually it is right after
        "tree/master/" in the repository's URL.
    output_path : str
        Path of the folder where the files will be saved. Can be a relative
        path or an absolute path.
    name_converter : Union[str, callable]
        If a callable, it is the function that converts the name of the file.
        It should take a single argument corresponding to the name of the file
        as stored in the repository, and return the name of the file as it
        should be saved. If a string, it should be "index.ts", meaning that
        the function will try to use the index.ts file to convert the names. If
        the string is not "index.ts", the function will use the original name
        of the file.
    force_download : bool, optional
        If True, the function will download all the files again, even if they
        already exist in the output folder. If False, the function will skip
        folders which already have the expected number of files, by default
        False
    expected_files : int, optional
        When force_download is False, the function will skip folders which
        already have this number of files (or more), by default 1

    Notes
    -----
    When using the method "checkout", it will always ignore "force_download"
    and "expected_files", as it will download all the files in the given path.
    Since doing a checkout does not use the GitHub API, this method might be
    faster and can be used without rate limits.
    """

    if METHOD == "checkout":

        # Getting all images of the checked out repo
        images = glob.glob(os.path.join(TEMP_FOLDER, GO_REPO, path, "**", "*"), recursive=True)
        logging.info(f"Found {len(images)} items in " + os.path.join(path, "**", "*"))
        for ii in range(len(images)):
            image = images[ii]
            ext = image.split(".")[-1]
            if ext not in extensions:
                continue

            # Getting the new filename
            old_filename = os.path.basename(image)

            if old_filename == "expCurve.json":
                continue

            if callable(name_converter):
                filename = name_converter(old_filename)
            elif isinstance(name_converter, str) and name_converter == "index.ts":
                image_folder = os.path.dirname(image)
                index_dot_ts = open(os.path.join(image_folder, "index.ts")).read()
                filename = intex_dot_ts2name_converter(index_dot_ts, old_filename)
            elif isinstance(name_converter, str) and name_converter == "values":
                image_folder = os.path.dirname(image)
                filename = image_folder.split("\\")[-1].lower() + ".json"

            # Getting the path for the current image
            folder = os.path.basename(os.path.dirname(image))
            if isinstance(name_converter, str) and name_converter == "values":
                folder = ""
            real_output_path = os.path.join(MASTER_OUTPUT_PATH, output_path, folder.lower())
            os.makedirs(real_output_path, exist_ok=True)

            # Copy the image to the output folder
            shutil.copy(image, os.path.join(real_output_path, filename))
            logging.info(f"({ii+1}/{len(images)}) Downloaded {filename}!")

        return

    # Getting all folders
    url = f"https://api.github.com/repos/{GO_OWNER}/{GO_REPO}/contents/{path}"
    response = requests.get(url, auth=AUTH)  # TODO: lower the number of requests

    # Check if there is a field "message"
    if "message" in response.json():
        logging.error(f"Error: {response.json()['message']}")
        return
    
    if response.status_code == 200:
        contents = response.json()
        folders = [file['name'] for file in contents if file['type'] == 'dir']
        for folder in folders:

            # DEBUG
            # if folder != "Furina":
            #     continue

            # Create a local folder for each folder in the repo
            logging.info(f"Trying to download {folder}...")
            folder_path = os.path.join(MASTER_OUTPUT_PATH, output_path, folder.lower())
            os.makedirs(folder_path, exist_ok=True)

            # Check if the folder already exists
            if not force_download and len(os.listdir(folder_path)) >= expected_files:
                logging.info(f"Skipping as it already exists!")
                continue

            # Getting all images of the set
            url = f"https://api.github.com/repos/{GO_OWNER}/{GO_REPO}/contents/{path}/{folder}"
            response = requests.get(url, auth=AUTH)  # TODO: lower the number of requests
            if response.status_code == 200:
                contents = response.json()
                images = [
                    file['download_url']
                    for file in contents
                    if file['type'] == 'file'
                    and file['name'].lower().endswith(tuple(extensions))
                ]
                if isinstance(name_converter, str) and name_converter == "index.ts":
                    index_dot_ts = requests.get(f"https://raw.githubusercontent.com/{GO_OWNER}/{GO_REPO}/master/{path}/{folder}/index.ts").text

                # Downloading all the images
                for image in images:
                    response = requests.get(image, auth=AUTH)  # TODO: lower the number of requests
                    old_filename = image.split("/")[-1]
                    if callable(name_converter):
                        filename = name_converter(old_filename)
                    elif isinstance(name_converter, str) and name_converter == "index.ts":
                        filename = intex_dot_ts2name_converter(index_dot_ts, old_filename)
                    with open(os.path.join(MASTER_OUTPUT_PATH, output_path, folder.lower(), filename), 'wb') as f:
                        f.write(response.content)
                    logging.info(f"Downloaded {filename}!")


def download_artifacts():

    # Defining how to extract the names of the files
    def name_converter(old_filename: str) -> str:

        # Define the pattern
        pattern = r"UI_RelicIcon_\d+_(\d)\.([a-z]+)"

        # Get extension
        ext = re.search(pattern, old_filename).group(2)

        # Get the filename
        number2artifact = {
            "1": "coupe",
            "2": "plume",
            "3": "couronne",
            "4": "fleur",
            "5": "sablier",
        }
        filename = number2artifact[re.search(pattern, old_filename).group(1)]
        return f"{filename}.{ext}"

    # Downloading the artifacts
    download_recursively(
        path="libs/gi/assets/src/gen/artifacts",
        output_path="gamedata/assets/artifacts/",
        name_converter=name_converter,
        extensions=GO_EXTENSIONS_IMAGES,
        force_download=FORCE,
        expected_files=5,
    )


def download_characters():
    
    # Character's base assets
    download_recursively(
        path = "libs/gi/assets/src/gen/chars",
        output_path="gamedata/assets/characters/",
        name_converter="index.ts",
        extensions=GO_EXTENSIONS_IMAGES,
        force_download=FORCE,
        expected_files=15,
    )
    
    # Character namecards
    def name_converter(old_filename: str) -> str:
        ext = old_filename.split(".")[-1]
        return f"card.{ext}"
    
    def output_path(old_filename: str) -> str:
        if "Character" in old_filename:
            pattern = "Character_([A-Za-z_]+)_Card\.[a-z]+"
            character_name = re.search(pattern, old_filename).group(1).lower()
        elif "Traveler" in old_filename:
            if "Traveler_Female" in old_filename:
                character_name = "travelerf"
            elif "Traveler_M" in old_filename:
                character_name = "travelerm"
        while "_" in character_name:
            character_name = character_name.replace("_", "")
        return os.path.join("gamedata/assets/characters", character_name)
    
    download_folder(
        path="libs/gi/char-cards/src",
        output_path=output_path,
        name_converter=name_converter,
        extensions=GO_EXTENSIONS_IMAGES
    )


def download_weapons():

    def name_converter(old_filename: str) -> str:
        
        # Get the extension
        ext = old_filename.split(".")[-1]

        # Check in which case we are
        if "Awaken" in old_filename:
            return f"weapon-awake.{ext}"
        else:
            return f"weapon.{ext}"
    
    download_recursively(
        path = "libs/gi/assets/src/gen/weapons",
        output_path="gamedata/assets/weapons/",
        name_converter=name_converter,
        extensions=GO_EXTENSIONS_IMAGES,
        force_download=FORCE,
        expected_files=15,
    )

def download_locale():

        def name_converter(old_filename: str) -> str:
            splits = old_filename.split("_")
            if len(splits) > 2 :
                return f"{splits[1].lower()}.json"
            return old_filename
    
        def output_path(old_filename: str) -> str:
            prefix = old_filename.split("_")[0]
            base_output = "gamedata/locale/"
            suffix = "default"
            if "char" in prefix:
                suffix = "characters"
            elif "weapon" in prefix:
                suffix = "weapons"
            elif "artifact" in prefix:
                suffix = "artifacts"

            return f"{base_output}{suffix}"

        download_folder(
        path="libs/gi/dm-localization/assets/locales/en",
        output_path=output_path,
        name_converter=name_converter,
        extensions=GO_EXTENSIONS_DATA
    )
        
def download_values():
    download_recursively(
        path = "libs/gi/stats/Data/Characters/",
        output_path="gamedata/characters/",
        name_converter="values",
        extensions=GO_EXTENSIONS_DATA,
        force_download=FORCE,
        expected_files=15,
    )


def main(**kwargs):

    os.makedirs(MASTER_OUTPUT_PATH, exist_ok=True)

    if METHOD == "checkout":
        if kwargs["characters"] or kwargs["artifacts"] or kwargs["weapons"]:
            sparse_checkout(path_to_checkout="libs/gi/assets/src/gen")
            sparse_checkout(path_to_checkout="libs/gi/char-cards/src")
        if kwargs["data"]:
            checkout_eikonomiya()
        if kwargs["locale"]:
            sparse_checkout(path_to_checkout="libs/gi/dm-localization/assets/locales/en")
        if kwargs["values"]:
            sparse_checkout(path_to_checkout="libs/gi/stats/Data/Characters")

    if kwargs["characters"]:
        download_characters()

    if kwargs["artifacts"]:
        download_artifacts()
    
    if kwargs["weapons"]:
        download_weapons()

    if kwargs["data"]:
        update_eikonomiya_data()

    if kwargs["locale"]:
        download_locale()

    if kwargs["values"]:
        download_values()

    if METHOD == "checkout" and not kwargs["keep"]:
       del_temp_folder()

    logging.info("Done.")


if __name__ == "__main__":

    # Configure logging
    logging.basicConfig(
        stream=sys.stdout,
        level=logging.INFO,
        format="[%(asctime)s] [%(levelname)-8s] --- %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handlers = logging.getLogger()
    fileLogger = logging.FileHandler("go2eiko.log")
    fileLogger.setFormatter(logging.Formatter("[%(asctime)s] [%(levelname)-8s] --- %(message)s"))
    handlers.addHandler(fileLogger)

    # Setting up the parser
    parser = argparse.ArgumentParser(
        description="Download the assets from Genshin Optimizer"
    )
    parser.add_argument("--method", "-m", type=str, help="Method to use", choices=["api", "checkout"], required=True)
    parser.add_argument("--characters", "-c", action="store_true", help="Download the characters' assets")
    parser.add_argument("--weapons", "-w", action="store_true", help="Download the weapons' assets")
    parser.add_argument("--artifacts", "-a", action="store_true", help="Download the artifacts' assets")
    parser.add_argument("--data", "-d", action="store_true", help="Download eikonomiya data")
    parser.add_argument("--locale", "-l", action="store_true", help="Download locales (EN)")
    parser.add_argument("--values", "-v", action="store_true", help="Download in-game talent values")
    parser.add_argument("--force", "-f", action="store_true", help="Force the redownload of all the assets")
    parser.add_argument("--output", "-o", type=str, help="Path of the 'data' folder", default=DEFAULT_MASTER_OUTPUT_PATH)
    parser.add_argument("--keep", "-k", action="store_true", help="If using 'checkout' method, keep the temp folder")
    kwargs = vars(parser.parse_args())
    MASTER_OUTPUT_PATH = kwargs["output"]
    TEMP_FOLDER = os.path.join(MASTER_OUTPUT_PATH, "temp")
    FORCE = kwargs["force"]
    METHOD = kwargs["method"]

    # Logging to GitHub's API
    if METHOD == "api":
        env_vars = [
            "EIKONOMIYA_GITHUB_USERNAME",
            "EIKONOMIYA_GITHUB_TOKEN",
        ]
        if not all(env_var in os.environ for env_var in env_vars):
            logging.error("Please define the following environment variables: " + ", ".join(env_vars) + ".")
            exit(1)
        username = os.environ[env_vars[0]]
        token = os.environ[env_vars[1]]
        AUTH = (username, token)

    # Run the main function
    main(**kwargs)
