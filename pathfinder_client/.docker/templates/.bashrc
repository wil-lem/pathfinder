source /root/git-prompt.sh

PATH=$PATH:/root/.composer/vendor/bin/


BGreen='\e[1;32m'       # Green
Yellow='\e[0;33m'       # Yellow
BCyan='\e[1;36m'        # Cyan
BYellow='\e[1;33m'      # Yellow
BGreen='\e[1;32m'       # Green
Color_Off='\e[0m'       # Text Reset
Blue='\e[1;34m'
LightRed='\e[91m'


export PS1='\['$BGreen'\]\u''\['$LightRed'\] @ DOCKER:__project_name__: ''\['$BCyan'\]$PWD''\['$BYellow'\]$(__git_ps1 " (%s)")''\n\[\033[0;32m\]└─\[\033[0m\033[0;32m\] \$\[\033[0m\033[0;32m\] ▶\[\033[0m\] '

