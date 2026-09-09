CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
