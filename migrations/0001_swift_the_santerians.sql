CREATE TABLE `races` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description_short` text NOT NULL,
	`description_long` text NOT NULL,
	`average_height_min` integer NOT NULL,
	`average_height_max` integer NOT NULL,
	`average_weight_min` integer NOT NULL,
	`average_weight_max` integer NOT NULL,
	`ability_scores` text NOT NULL,
	`size` text NOT NULL,
	`speed` integer NOT NULL,
	`vision` text NOT NULL,
	`traits` text NOT NULL
);
