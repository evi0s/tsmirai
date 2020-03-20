#!/usr/bin/env bash


PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin
export PATH


Check_Command() {
    local ret='0'
    command -v $1 > /dev/null 2>&1 || { local ret='1'; }

    # Fail on non-zero return value
    if [[ "$ret" -ne 0 ]]; then
        return 1
    fi

    return 0
}

Check_Plugin_Dir() {
    if [[ ! -d "plugins" ]]; then
        mkdir plugins
    fi
}

Download_File() {
	curl -k -SL $1 -o $2
}

Main() {
    Check_Command java

    if [[ "$?" -ne 0 ]]; then
        echo "Please install jre/jdk first!"
        exit
    fi

    Check_Command curl

    if [[ "$?" -ne 0 ]]; then
        echo "Please install curl first!"
        exit
    fi

    # Check plugins
    Check_Plugin_Dir

    # Get console jar
    Download_File https://github.com/mamoe/mirai-console/releases/download/wrapper-0.1.3/mirai-console-wrapper-0.1.3-all.jar mirai-console.jar

    # Get HTTP api jar
    Download_File https://github.com/mamoe/mirai-api-http/releases/download/v.1.2.3/mirai-api-http-v1.2.3.jar ./plugins/mirai-api-http-v1.2.3.jar

}


Main
