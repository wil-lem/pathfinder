<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', $_ENV['MYSQL_DATABASE']);

/** MySQL database username */
define('DB_USER', $_ENV['MYSQL_USER']);

/** MySQL database password */
define('DB_PASSWORD', $_ENV['MYSQL_PASSWORD']);

/** MySQL hostname */
define('DB_HOST', $_ENV['MYSQL_DB_HOST']);

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'B3vfhz&<PD#IArU$ #VMN*2t:YLRZzHGsMt$9rZZ{BmEHxqv;.56eU[X|;>:DVEE');
define('SECURE_AUTH_KEY',  '6[!?qoe>?a(-xM&LitIgj2aiUR=83u_[NPM0v;.-:|mMv9*a$o|vJVCS>hL]yJ6D');
define('LOGGED_IN_KEY',    ')ofQ~pInc0%d#9#*kA{nn}]nd9_b~].5<aIsAs4{3}6NViN&!*zwt4twbyl[TA /');
define('NONCE_KEY',        'a=btWg!Jw>cDz&&Xj6s2^>7 D1EH+ fxxBEvH&)02^IFN`-/<T>F)=h0&&)iu. 7');
define('AUTH_SALT',        '9y6P<Q!`~vPc4ElMEs3H_=WP#oq1+7nXS]|%.Q,bdSlxIi?]m)FOVl7sZ3*[b|i9');
define('SECURE_AUTH_SALT', 'eahS%@X/HP;qc6YAdZ][]3=w`&#.+;:+)Zd`s+:2n(P6xl6Sxnn{;>h||l9]5dC+');
define('LOGGED_IN_SALT',   '!2()B,>I%c?9-I.@1`)-KV6<%# ;<e!so^C+#c%B^`4[8@LpLs+pyJn2i$P{*GG>');
define('NONCE_SALT',       '[JdU+#pROdIPW5~8-Pk!r^>rj?U[s ,zwV36f_N|}fHuA{bGN@qv@H|GiT#>DCHh');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', $_ENV['DEBUG_ON']);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
  define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
