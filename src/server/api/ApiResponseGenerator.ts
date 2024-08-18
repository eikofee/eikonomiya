import { NextResponse } from "next/server";

export enum EStatusCode {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
}

export enum EDataType {
    JSON,
    PNG,
    TXT
}

export function apiResponse(statusCode: EStatusCode = EStatusCode.SUCCESS, content? : any, text? : string, dataType : EDataType = EDataType.JSON) {
    if (text == undefined) {
        switch (statusCode) {
            case EStatusCode.SUCCESS:
                text = "Success"
                break;
            case EStatusCode.BAD_REQUEST:
                text = "Bad request"
                break;
            case EStatusCode.FORBIDDEN:
                text = "Forbidden"
                break;
            case EStatusCode.NOT_FOUND:
                text = "Item not found"
                break;
            case EStatusCode.INTERNAL_ERROR:
                text = "Internal error"
                break;
        }
    }
    if (content == undefined) {
        content = JSON.stringify({
            status: statusCode,
            message: text
        })
    }

    const res = new NextResponse(
        content, {
            status: statusCode,
    })

    switch (dataType) {
        case EDataType.PNG:
            res.headers.set("Content-Type", "image/png")
            break;
        
        case EDataType.JSON:
            res.headers.set("Content-Type", "application/json")
            break;

        case EDataType.TXT:
            res.headers.set("t", "text/plain")
            break;
    }


    res.headers.set("Access-Control-Allow-Origin", "*")
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return res
}