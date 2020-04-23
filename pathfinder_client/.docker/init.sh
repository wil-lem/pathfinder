#!/bin/bash

if [ "${BUILD_ENV}" == "dev" ]; then
  echo "Setting urls to ${BASE_URL}"
  mysql -u ${MYSQL_USER}  -p${MYSQL_PASSWORD} -h ${MYSQL_DB_HOST} -e "UPDATE wp_options SET option_value = '${BASE_URL}' WHERE option_name='siteurl'" ${MYSQL_DATABASE}
  mysql -u ${MYSQL_USER}  -p${MYSQL_PASSWORD} -h ${MYSQL_DB_HOST} -e "UPDATE wp_options SET option_value = '${BASE_URL}' WHERE option_name='home'" ${MYSQL_DATABASE}
  echo "Hacking admin user"
  mysql -u ${MYSQL_USER}  -p${MYSQL_PASSWORD} -h ${MYSQL_DB_HOST} -e "UPDATE wp_users SET user_pass=MD5('admin'), user_login = 'admin' WHERE ID=1" ${MYSQL_DATABASE}
  echo "Removing simple ssl"
  rm -r /app/web/wp-content/plugins/really-simple-ssl
fi
