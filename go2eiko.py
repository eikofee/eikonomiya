import requests
import os
import re
import logging
from dotenv import load_dotenv
import argparse
from typing import Union


# Constants
EXTENSIONS = ['.png', '.jpg', '.jpeg']
AUTH = None  # TODO: might not be the most secured way to store the credentials


# Informations about the repository
OWNER = "frzyc"
REPO = "genshin-optimizer"


# User specific
MASTER_OUTPUT_PATH = None
FORCE = None


def download_folder(
    path: str,
    output_path: Union[str, callable],
    name_converter: callable,
):

    # Getting all images of the set
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}"
    response = requests.get(url, auth=AUTH)  # TODO: lower the number of requests
    if response.status_code == 200:
        contents = response.json()
        images = [
            file['download_url']
            for file in contents
            if file['type'] == 'file'
            and file['name'].lower().endswith(tuple(EXTENSIONS))
        ]

        # Downloading all the images
        for image in images:
            response = requests.get(image, auth=AUTH)  # TODO: lower the number of requests
            old_filename = image.split("/")[-1]
            filename = name_converter(old_filename)
            
            real_output_path = None
            if callable(output_path):
                real_output_path = output_path(old_filename)
            else:
                real_output_path = output_path
            
    
            # Create a local folder (if needed)
            logging.info(f"Trying to download {path}...")
            folder_path = os.path.join(MASTER_OUTPUT_PATH, real_output_path)
            os.makedirs(folder_path, exist_ok=True)
            
            # Save the file in the folder
            with open(os.path.join(MASTER_OUTPUT_PATH, real_output_path, filename), 'wb') as f:
                f.write(response.content)
            logging.info(f"Downloaded {filename}!")

    


def download_recursively(
    path: str,
    output_path: str,
    name_converter: callable,
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
    name_converter : callable
        Function that converts the name of the file. It should take a single
        argument corresponding to the name of the file as stored in the
        repository, and return the name of the file as it should be saved.
    force_download : bool, optional
        If True, the function will download all the files again, even if they
        already exist in the output folder. If False, the function will skip
        folders which already have the expected number of files, by default
        False
    expected_files : int, optional
        When force_download is False, the function will skip folders which
        already have this number of files (or more), by default 1
    """

    # Getting all folders
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}"
    print(url)
    response = requests.get(url, auth=AUTH)  # TODO: lower the number of requests

    # Check if there is a field "message"
    if "message" in response.json():
        logging.error(f"Error: {response.json()['message']}")
        return
    
    if response.status_code == 200:
        contents = response.json()
        folders = [file['name'] for file in contents if file['type'] == 'dir']
        for folder in folders:

            # Create a local folder for each folder in the repo
            logging.info(f"Trying to download {folder}...")
            folder_path = os.path.join(MASTER_OUTPUT_PATH, output_path, folder.lower())
            os.makedirs(folder_path, exist_ok=True)

            # Check if the folder already exists
            if not force_download and len(os.listdir(folder_path)) >= expected_files:
                logging.info(f"Skipping as it already exists!")
                continue

            # Getting all images of the set
            url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}/{folder}"
            response = requests.get(url, auth=AUTH)  # TODO: lower the number of requests
            if response.status_code == 200:
                contents = response.json()
                images = [
                    file['download_url']
                    for file in contents
                    if file['type'] == 'file'
                    and file['name'].lower().endswith(tuple(EXTENSIONS))
                ]

                # Downloading all the images
                for image in images:
                    response = requests.get(image, auth=AUTH)  # TODO: lower the number of requests
                    old_filename = image.split("/")[-1]
                    filename = name_converter(old_filename)
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
        force_download=FORCE,
        excepted_files=5,
    )


def download_characters():
    
    # # Character's base assets
    # def name_converter(old_filename: str) -> str:
        
    #     # Get the extension
    #     ext = old_filename.split(".")[-1]

    #     # Define the patterns
    #     pattern_face = r"UI_AvatarIcon_[A-Za-z]+\.[a-z]+"
    #     pattern_constellation = r"UI_Talent_S_[A-Za-z]+_0(\d)\.[a-z]+"
    #     pattern_namecard = r"UI_NameCardPic_[A-Za-z]+_P\.[a-z]+"
    #     pattern_skill = r"Skill_S_[A-Za-z]+01\.[a-z]+"

    #     # Check to which pattern the filename corresponds
    #     if re.match(pattern_face, old_filename):
    #         return f"face.{ext}"
    #     elif re.match(pattern_constellation, old_filename):
    #         number = re.search(pattern_constellation, old_filename).group(1)
    #         return f"c{number}.{ext}"
    #     elif re.match(pattern_namecard, old_filename):
    #         return f"namecard.{ext}"
    #     elif re.match(pattern_skill, old_filename):
    #         return f"skill.{ext}"
    #     else:
    #         return old_filename

    # download_recursively(
    #     path = "libs/gi/assets/src/gen/chars",
    #     output_path="gamedata/assets/characters/",
    #     name_converter=name_converter,
    #     force_download=FORCE,
    #     expected_files=15,
    # )
    
    # Character namecards
    def name_converter(old_filename: str) -> str:
        ext = old_filename.split(".")[-1]
        return f"card.{ext}"
    
    def output_path(old_filename: str) -> str:
        pattern = "Character_([A-Za-z_]+)_Card.[a-z]+"
        character_name = re.search(pattern, old_filename).group(1).lower()
        return os.path.join("gamedata/assets/characters", character_name)
    
    download_folder(
        path="libs/gi/char-cards/src",
        output_path=output_path,
        name_converter=name_converter,
    )
    
    


def download_weapons():

    def name_converter(old_filename: str) -> str:
        
        # Get the extension
        ext = old_filename.split(".")[-1]

        # Check in which case we are
        if "Awaken" in old_filename:
            return f"weapon-awaken.{ext}"
        else:
            return f"weapon.{ext}"
    
    download_recursively(
        path = "libs/gi/assets/src/gen/weapons",
        output_path="gamedata/assets/weapons/",
        name_converter=name_converter,
        force_download=FORCE,
        expected_files=15,
    )


def main(**kwargs):

    os.makedirs(MASTER_OUTPUT_PATH, exist_ok=True)

    if kwargs["characters"]:
        download_characters()

    if kwargs["artifacts"]:
        download_artifacts()
    
    if kwargs["weapons"]:
        download_weapons()


if __name__ == "__main__":

    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] [%(levelname)-8s] --- %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Setting up the parser
    parser = argparse.ArgumentParser(
        description="Download the assets from Genshin Optimizer"
    )
    parser.add_argument("--characters", "-c", action="store_true", help="Download the characters' assets")
    parser.add_argument("--weapons", "-w", action="store_true", help="Download the weapons' assets")
    parser.add_argument("--artifacts", "-a", action="store_true", help="Download the artifacts' assets")
    parser.add_argument("--force", "-f", action="store_true", help="Force the redownload of all the assets")
    parser.add_argument("--output", "-o", type=str, help="Path of the 'data' folder", default="./data/")
    kwargs = vars(parser.parse_args())
    MASTER_OUTPUT_PATH = kwargs["output"]
    FORCE = kwargs["force"]

    # Logging to GitHub's API
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(dotenv_path)
    username = os.environ.get('GITHUB_USERNAME')
    token = os.environ.get('GITHUB_TOKEN')
    AUTH = (username, token)

    # Run the main function
    main(**kwargs)