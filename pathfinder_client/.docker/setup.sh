clear
read -p "Project friendly name?" FRIENDLY_NAME
read -p "Project key [$FRIENDLY_NAME]" PROJECT_KEY
if [ -z "$PROJECT_KEY" ]
then
      PROJECT_KEY=$FRIENDLY_NAME
fi

read -p "DB Name (leave emtpy for options)" DB_NAME
if [ -z "$DB_NAME" ]
then
  read -p "Random DB name (y=random,n=[${PROJECT_KEY}_db])" YN
  case $YN in
        [Yy]* ) DB_NAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1);;
        * ) DB_NAME="${PROJECT_KEY}_db";;
  esac
fi

read -p "DB User Name (leave emtpy for options)" DB_USER_NAME
if [ -z "${DB_USER_NAME}" ]
then
  read -p "Random DB User Name (y=random,n=[${PROJECT_KEY}_db_user])" YN
  case $YN in
        [Yy]* ) DB_USER_NAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1);;
        * ) DB_USER_NAME="${PROJECT_KEY}_db_user";;
  esac
fi

read -p "Web port [8080]" WEB_PORT
if [ -z "${WEB_PORT}" ]
then
  WEB_PORT="8080"
fi

read -p "DB port [3306]" DB_PORT
if [ -z "${DB_PORT}" ]
then
  DB_PORT="3306"
fi

read -p "PMA port [8181]" PMA_PORT
if [ -z "${PMA_PORT}" ]
then
  PMA_PORT="8181"
fi

read -p "Live url [http://localhost:${WEB_PORT}]" LIVE_URL
if [ -z "${LIVE_URL}" ]
then
  LIVE_URL="http://localhost:${WEB_PORT}"
fi

read -p "Dev url [http://localhost:${WEB_PORT}]" DEV_URL
if [ -z "${DEV_URL}" ]
then
  DEV_URL="http://localhost:${WEB_PORT}"
fi

read -p "Host names (comma seperated)" HOST_NAMES

read -p "Build environment [dev]" BUILD_ENV
if [ -z "${BUILD_ENV}" ]
then
  BUILD_ENV="dev"
fi

DB_USER_PASS=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
DB_USER_ROOT_PASS=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)



echo "Friendly name:     $FRIENDLY_NAME"
echo "Key                $PROJECT_KEY"
echo "Db name:           $DB_NAME"
echo "Db user name:      $DB_USER_NAME"
echo "Db user pass:      $DB_USER_PASS"
echo "Db root pass:      $DB_USER_ROOT_PASS"
echo "Web port:          ${WEB_PORT}"
echo "Db port:           ${DB_PORT}"
echo "Pma port:          ${PMA_PORT}"
echo "Live url:          ${LIVE_URL}"
echo "Dev url:           ${DEV_URL}"
echo "Host names:        ${HOST_NAMES}"
echo "Build env:         ${BUILD_ENV}"



cp templates/.env_example ./.env
cp templates/.bashrc ./config/.bashrc
cp templates/docker/docker-compose.yml ./
cp templates/docker/docker-compose-dev.yml ./
cp templates/docker/docker-compose-prod.yml ./
cp templates/docker/Dockerfile ./


sed -i "s/__project_name__/${FRIENDLY_NAME}/g" ./config/.bashrc
sed -i "s/__project_key__/${PROJECT_KEY}/g" .env
sed -i "s/__project_db__/${DB_NAME}/g" .env
sed -i "s/__project_db_user__/${DB_USER_NAME}/g" .env
sed -i "s/__project_db_pass__/${DB_USER_PASS}/g" .env
sed -i "s/__project_db_root_pass__/${DB_USER_ROOT_PASS}/g" .env

sed -i "s/__project_dev_web_port__/${WEB_PORT}/g" .env
sed -i "s/__project_db_port__/${DB_PORT}/g" .env
sed -i "s/__project_pma_port__/${PMA_PORT}/g" .env

sed -i "s#__project_base_live_url__#${LIVE_URL}#g" .env
sed -i "s#__project_base_dev_url__#${DEV_URL}#g" .env
sed -i "s#__project_host_names__#${HOST_NAMES}#g" .env
sed -i "s#__build_env__#${BUILD_ENV}#g" .env


sed -i "s#__project_key__#${PROJECT_KEY}#g" docker-compose.yml
sed -i "s#__project_key__#${PROJECT_KEY}#g" docker-compose-dev.yml
sed -i "s#__project_key__#${PROJECT_KEY}#g" docker-compose-prod.yml
sed -i "s#__project_key__#${PROJECT_KEY}#g" in.sh


