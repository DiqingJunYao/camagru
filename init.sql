CREATE DATABASE IF NOT EXISTS camagru;

USE camagru;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    is_verified TINYINT(1) DEFAULT 0,
    verification_token VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_username (username),
    UNIQUE KEY unique_email (email)
);

CREATE TABLE IF NOT EXISTS uploads (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    size_bytes BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_uploads_user_id (user_id),
    CONSTRAINT fk_uploads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
