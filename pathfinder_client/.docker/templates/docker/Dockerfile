FROM php:7.2-apache-stretch

RUN apt-get update && apt-get install -y \
	curl \
	git \
	mysql-client \
	vim \
	wget \
	nano \
    zip \
    libfreetype6-dev \
    libjpeg62-turbo-dev


WORKDIR /app

RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
#RUN docker-php-ext-install pdo_mysql mysqli mysql gd
RUN docker-php-ext-install mysqli pdo pdo_mysql gd

RUN a2enmod rewrite


ARG build_env
RUN if [ "$build_env" = "dev" ] ; then pecl install xdebug; fi
RUN service apache2 restart
