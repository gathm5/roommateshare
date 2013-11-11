SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `RentalDB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `RentalDB` ;

-- -----------------------------------------------------
-- Table `RentalDB`.`UserInformation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`UserInformation` (
  `id_userinformation` INT NOT NULL AUTO_INCREMENT,
  `fname` VARCHAR(25) NOT NULL,
  `lname` VARCHAR(25) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `gender` CHAR(1) NULL,
  `ip_register` VARCHAR(16) NULL,
  `is_active` TINYINT NULL DEFAULT 1,
  `is_subscribed` TINYINT NULL DEFAULT 1,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NULL,
  PRIMARY KEY (`id_userinformation`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`Country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`Country` (
  `id_country` INT NOT NULL AUTO_INCREMENT,
  `country_name` VARCHAR(45) NOT NULL,
  `country_code` VARCHAR(45) NULL,
  PRIMARY KEY (`id_country`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`State`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`State` (
  `id_state` INT NOT NULL AUTO_INCREMENT,
  `state_name` VARCHAR(45) NULL,
  `state_code` VARCHAR(10) NULL,
  `id_country` INT NULL,
  PRIMARY KEY (`id_state`),
  INDEX `fk_country_idx` (`id_country` ASC),
  CONSTRAINT `fk_state_country`
    FOREIGN KEY (`id_country`)
    REFERENCES `RentalDB`.`Country` (`id_country`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`City`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`City` (
  `id_city` INT NOT NULL AUTO_INCREMENT,
  `city_name` VARCHAR(45) NULL,
  `id_state` INT NULL,
  PRIMARY KEY (`id_city`),
  INDEX `fk_state_idx` (`id_state` ASC),
  CONSTRAINT `fk_city_state`
    FOREIGN KEY (`id_state`)
    REFERENCES `RentalDB`.`State` (`id_state`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`Zipcode`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`Zipcode` (
  `id_zipcode` INT NOT NULL AUTO_INCREMENT,
  `id_city` INT NULL,
  `zipcode` VARCHAR(20) NOT NULL,
  `latitude` DECIMAL(11,6) NULL,
  `longitude` DECIMAL(11,6) NULL,
  PRIMARY KEY (`id_zipcode`),
  INDEX `fk_city_idx` (`id_city` ASC),
  CONSTRAINT `fk_zipcode_city`
    FOREIGN KEY (`id_city`)
    REFERENCES `RentalDB`.`City` (`id_city`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`Address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`Address` (
  `id_address` INT NOT NULL AUTO_INCREMENT,
  `street_address1` VARCHAR(45) NULL,
  `street_address2` VARCHAR(45) NULL,
  `id_zipcode` INT NULL,
  `id_userinformation` INT NULL,
  PRIMARY KEY (`id_address`),
  INDEX `fk_zipcode_idx` (`id_zipcode` ASC),
  INDEX `fk_userinformation_idx` (`id_userinformation` ASC),
  CONSTRAINT `fk_address_zipcode`
    FOREIGN KEY (`id_zipcode`)
    REFERENCES `RentalDB`.`Zipcode` (`id_zipcode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_address_userinformation`
    FOREIGN KEY (`id_userinformation`)
    REFERENCES `RentalDB`.`UserInformation` (`id_userinformation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`RentalInformation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`RentalInformation` (
  `id_rentalinformation` INT NOT NULL AUTO_INCREMENT,
  `id_userinformation` INT NULL,
  `id_address` INT NULL,
  `ad_title` VARCHAR(80) NULL,
  `area_name` VARCHAR(45) NULL,
  `ad_description` TINYTEXT NULL,
  `monthly_rent` DECIMAL(10,3) NULL DEFAULT 0,
  `deposit` DECIMAL(10,3) NULL DEFAULT 0,
  `date_available` DATE NULL,
  `roommate_preference` CHAR(1) NULL DEFAULT 'A',
  `bedroom_count` INT NULL DEFAULT 1,
  `bathroom_count` INT NULL DEFAULT 1,
  `parking` VARCHAR(30) NULL DEFAULT 'street',
  `contact_name` VARCHAR(45) NULL,
  `contact_email` VARCHAR(80) NULL,
  `contact_phone` VARCHAR(20) NULL,
  `post_date` DATETIME NULL,
  `update_date` DATETIME NULL,
  `is_active` CHAR(1) NULL DEFAULT 'Y',
  PRIMARY KEY (`id_rentalinformation`),
  INDEX `fk_userinformation_idx` (`id_userinformation` ASC),
  INDEX `fk_address_idx` (`id_address` ASC),
  CONSTRAINT `fk_rentalinformation_userinformation`
    FOREIGN KEY (`id_userinformation`)
    REFERENCES `RentalDB`.`UserInformation` (`id_userinformation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rentalinformation_address`
    FOREIGN KEY (`id_address`)
    REFERENCES `RentalDB`.`Address` (`id_address`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`GeoSpatial`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`GeoSpatial` (
  `id_geospatial` INT NOT NULL AUTO_INCREMENT,
  `geo_lat` DECIMAL(11,6) NULL,
  `geo_lng` DECIMAL(11,6) NULL,
  `rounded_lat` DECIMAL(11,6) NULL,
  `rounded_lng` DECIMAL(11,6) NULL,
  `neighborhood` TINYTEXT NULL,
  `id_zipcode` INT NULL,
  PRIMARY KEY (`id_geospatial`),
  INDEX `fk_zipcode_idx` (`id_zipcode` ASC),
  CONSTRAINT `fk_geospatial_zipcode`
    FOREIGN KEY (`id_zipcode`)
    REFERENCES `RentalDB`.`Zipcode` (`id_zipcode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`ProfileInformation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`ProfileInformation` (
  `id_profileinformation` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(40) NOT NULL,
  `security_question` VARCHAR(80) NULL,
  `security_answer` VARCHAR(30) NULL,
  `profile_identifier` VARCHAR(45) NULL,
  PRIMARY KEY (`id_profileinformation`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`SocialLogin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`SocialLogin` (
  `id_sociallogin` INT NOT NULL AUTO_INCREMENT,
  `id_userinformation` INT NULL,
  `social_identifier` VARCHAR(45) NULL,
  PRIMARY KEY (`id_sociallogin`),
  INDEX `fk_sociallogin_userinformation_idx` (`id_userinformation` ASC),
  CONSTRAINT `fk_sociallogin_userinformation`
    FOREIGN KEY (`id_userinformation`)
    REFERENCES `RentalDB`.`UserInformation` (`id_userinformation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`Neighborhood`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`Neighborhood` (
  `id_neighborhood` INT NOT NULL AUTO_INCREMENT,
  `id_geospatial` INT NULL,
  `id_zipcode` INT NULL,
  `neighborhood` VARCHAR(45) NULL,
  PRIMARY KEY (`id_neighborhood`),
  INDEX `fk_geospatial_idx` (`id_geospatial` ASC),
  INDEX `fk_zipcode_idx` (`id_zipcode` ASC),
  CONSTRAINT `fk_neighborhood_geospatial`
    FOREIGN KEY (`id_geospatial`)
    REFERENCES `RentalDB`.`GeoSpatial` (`id_geospatial`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_neighborhood_zipcode`
    FOREIGN KEY (`id_zipcode`)
    REFERENCES `RentalDB`.`Zipcode` (`id_zipcode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`RentalImage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`RentalImage` (
  `id_rentalimage` INT NOT NULL AUTO_INCREMENT,
  `image_name` VARCHAR(45) NULL,
  `image_path` VARCHAR(45) NULL,
  `flagged_count` SMALLINT NULL DEFAULT 0,
  `id_rentalinformation` INT NULL,
  PRIMARY KEY (`id_rentalimage`),
  INDEX `fk_rentalinformation_idx` (`id_rentalinformation` ASC),
  CONSTRAINT `fk_rentalimage_rentalinformation`
    FOREIGN KEY (`id_rentalinformation`)
    REFERENCES `RentalDB`.`RentalInformation` (`id_rentalinformation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `RentalDB`.`FavoriteRental`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RentalDB`.`FavoriteRental` (
  `id_favoriterental` INT NOT NULL AUTO_INCREMENT,
  `id_userinformation` INT NULL,
  `id_rentalinformation` INT NULL,
  `favored_date` DATETIME NULL,
  PRIMARY KEY (`id_favoriterental`),
  INDEX `fk_userinformation_idx` (`id_userinformation` ASC),
  INDEX `fk_rentalinformation_idx` (`id_rentalinformation` ASC),
  CONSTRAINT `fk_favoriterental_userinformation`
    FOREIGN KEY (`id_userinformation`)
    REFERENCES `RentalDB`.`UserInformation` (`id_userinformation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_favoriterental_rentalinformation`
    FOREIGN KEY (`id_rentalinformation`)
    REFERENCES `RentalDB`.`RentalInformation` (`id_rentalinformation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
