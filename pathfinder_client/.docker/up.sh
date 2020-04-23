clear
echo " * 1) Live      - docker-compose.yml"
echo "   2) Dev       - docker-compose-dev.yml"

COMMAND="docker-compose -f docker-compose.yml"
read CHOICE

case $CHOICE in
  2)
    COMMAND="$COMMAND -f docker-compose-dev.yml up"
    ;;
  *)
    COMMAND="$COMMAND -f docker-compose-prod.yml up"
    ;;
  esac

clear
echo $COMMAND
echo "Build [y/N]"
read CHOICE
case $CHOICE in
  'y')
     COMMAND="$COMMAND --build"
    ;;
  esac

clear
echo $COMMAND
echo "Detached [y/N]"
read CHOICE
case $CHOICE in
  'y')
     COMMAND="$COMMAND -d"
    ;;
  esac

echo $COMMAND
eval $COMMAND


