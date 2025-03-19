-- Create database
CREATE DATABASE carolinian_accommodation;
USE carolinian_accommodation;

-- Create tables for the three item types with common properties
CREATE TABLE food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image MEDIUMBLOB,
    direction_link VARCHAR(255),
    open_hours VARCHAR(255)
);

CREATE TABLE leisure_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image MEDIUMBLOB,
    direction_link VARCHAR(255),
    open_hours VARCHAR(255)
);

CREATE TABLE service_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image MEDIUMBLOB,
    direction_link VARCHAR(255),
    open_hours VARCHAR(255)
);

-- Create table for tags (many-to-many relationship)
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create table for accommodation data
CREATE TABLE accommodation_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    contact_info VARCHAR(255),
    website VARCHAR(255),
    image MEDIUMBLOB
);

-- Junction tables for the many-to-many relationships between items and tags
CREATE TABLE food_item_tags (
    food_item_id INT,
    tag_id INT,
    PRIMARY KEY (food_item_id, tag_id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE leisure_item_tags (
    leisure_item_id INT,
    tag_id INT,
    PRIMARY KEY (leisure_item_id, tag_id),
    FOREIGN KEY (leisure_item_id) REFERENCES leisure_items(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE service_item_tags (
    service_item_id INT,
    tag_id INT,
    PRIMARY KEY (service_item_id, tag_id),
    FOREIGN KEY (service_item_id) REFERENCES service_items(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);