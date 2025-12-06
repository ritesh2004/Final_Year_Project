CREATE TABLE `sensor_data` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`temperature` int,
	`humidity` int,
	`wind_speed` int,
	`atmospheric_pressure` int,
	`radiation` int,
	`timestamp` timestamp DEFAULT (now()),
	CONSTRAINT `sensor_data_id` PRIMARY KEY(`id`)
);
