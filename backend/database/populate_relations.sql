-- populate RewardCategory table
insert into RewardCategory(Id, Description)
values(0, 'Other');
insert into RewardCategory(Id, Description)
values (1, 'Behavior');
insert into RewardCategory(Id, Description)
values (2, 'Hygeine');
insert into RewardCategory(Id, Description)
values (3, 'Time');
insert into RewardCategory(Id, Description)
values (4, 'Sweets');
insert into RewardCategory(Id, Description)
values (5, 'Snack/Drink');


-- populate Rewards table
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (1, 'Erase 1 Timeout', 1, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (2, 'Erase 1 RT or School Referral', 1, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (3, 'Deodorant', 2, 5, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (4, 'Colgate Toothpaste', 2, 5, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (5, 'Shampoo', 2, 5, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (6, 'Toothbrush', 2, 5, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (7, '5 min extra in the shower', 2, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (7, '5 min extra in the shower', 3, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (8, 'Head & Shoulders Dandruff Shampoo', 2, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (9, 'Lip Balm', 2, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (10, 'Dial Body Wash', 2, 20, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (11, 'Clean and Clear Face Wash', 2, 40, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (12, 'Milky Way dark', 4, 5, 3, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (13, '3 Musketeers', 4, 5, 3, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (14, 'Milky Way', 4, 5, 3, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (15, 'Twix', 4, 5, 3, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (16, 'Sour Punch Twist', 4, 10, 3, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (17, 'Slim Jim', 5, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (18, 'Dark Chocolate Chunk', 5, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (19, 'Chocolate Chip', 5, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (20, 'Kellogg\'s Strawberry', 5, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (21, 'Blueberry Fruit Bar', 5, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (22, 'Mott\'s Fuit Snacks', 5, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (23, 'Oreos', 4, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (24, 'Chips Ahoy', 4, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (25, 'Rice Krispies Treats', 4, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (26, 'Hot Cheetos', 5, 10, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (27, 'Takis', 5, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (28, 'Coconut Chocolate Chip', 5, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (29, 'White Chocolate Macadamia Nut', 5, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (30, 'Chocolate', 5, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (31, 'Brownie', 5, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (32, 'Kellog\'s Pop Tart (Strawberry, Cherry, Blueberry)', 5, 25, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (33, 'Gatorage', 5, 15, 1, "");
insert into Rewards(Id, Item, Category, Price, MaxQuantity, Image)
values (34, '5-minute non-collect phone call', 3, 15, 1, "");


-- populate Locations table
insert into Location(Id, Name)
values (1, 'Classroom');
insert into Location(Id, Name)
values (2, 'Yard/Gym');
insert into Location(Id, Name)
values (3, 'Units');
insert into Location(Id, Name)
values (4, 'Hallways');
insert into Location(Id, Name)
values (5, 'Room');
insert into Location(Id, Name)
values (6, 'Visiting');
insert into Location(Id, Name)
values (7, 'Health Services');
insert into Location(Id, Name)
values (8, 'Courtroom');
insert into Location(Id, Name)
values (9, 'Bathroom');
insert into Location(Id, Name)
values (10, 'Intake');
insert into Location(Id, Name)
values (11, 'Counseling');
insert into Location(Id, Name)
values (12, 'Movement');


-- populate BehaviorCategory table
insert into BehaviorCategory(Id, Name)
values (1, 'Safe');
insert into BehaviorCategory(Id, Name)
values (2, 'Responsible');
insert into BehaviorCategory(Id, Name)
values (3, 'Considerate');


-- populate Behaviors table
insert into Behaviors(Id, CategoryId, LocationId, Description)
values (1, 1, 1, 'Keep hands and feet to self');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values (2, 1, 1, 'Ask permission to move');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values (3, 1, 1, 'Remain seated');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values (4, 1, 1, 'Maintain personal boundaries');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values (5, 1, 1, 'Stay in front of all staff');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values (6, 1, 1, 'Resolve conflicts constructively');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(7, 2, 1,'Use supplies appropriately');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(8, 2, 1,'Keep track of assigned school supplies');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(9, 2, 1,'Return school supplies to staff');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(10, 2, 1,'Work attentively');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(11, 2, 1,'Participate in your education');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(12, 2, 1,'Ask for help');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(13, 2, 1,'Do your own work');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(14, 3, 1,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(15, 3, 1,'Raise hand and wait to be called on');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(16, 3, 1,'Listen when others are speaking');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(17, 3, 1,'Avoid profanity');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(18, 3, 1,'Stay focused and allow others to stay focused');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(19, 1, 2,'Keep hands and feet to self');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(20, 1, 2,'Remain 3 feet from fence');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(21, 1, 2,'Use equipment properly');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(22, 1, 2,'Resolve conflicts constructively');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(23, 1, 2,'Recreate in groups of 3 or less');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(24, 1, 2,'Report injuries');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(25, 1, 2,'Use inside voice in gym');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(26, 2, 2,'Participate in activities');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(27, 2, 2,'Follow rules of assigned activity');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(28, 2, 2,'Gives best effort');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(29, 2, 2,'Wear clothing properly');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(30, 2, 2,'Return all equipment to the proper place');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(31, 2, 2,'Ask permission to get water');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(32, 3, 2,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(33, 3, 2,'Throw away trash');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(34, 3, 2,'Refrain from spitting');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(35, 3, 2,'Display good sportsmanship');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(36, 3, 2,'Use appropriate language');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(37, 3, 2,'Include peers in activities');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(38, 1, 3,'Appropriate dress');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(39, 1, 3,'Ask permission before moving');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(40, 1, 3,'Resolve conflicts constructively');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(41, 1, 3,'Keep hands and feet to self');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(42, 2, 3,'Return all checked-out items');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(43, 2, 3,'Keep track of all checked-out items');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(44, 2, 3,'Participate in activities');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(45, 2, 3,'Prioritize time (use wisely)');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(46, 3, 3,'Follow all staff directives');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(47, 3, 3,'Appropriate language and conversations');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(48, 3, 3,'Quiet voices');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(49, 1, 4,'Hands behind back');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(50, 1, 4,'Eyes forward');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(51, 1, 4,'Stay within lines');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(52, 1, 4,'Remain silent unless saying "Crossing"');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(53, 1, 4,'Say "Crossing" appropriately when entering/exiting');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(54, 2, 4,'Prepare self for movement');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(55, 2, 4,'Walk directly to destination');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(56, 3, 4,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(57, 3, 4,'Keep personal space');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(58, 3, 4,'Save questions until out of movement');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(59, 1, 5,'Contraband-free');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(60, 1, 5,'Free of extra items');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(61, 1, 5,'Stay seated when staff enter');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(62, 2, 5,'Bed made');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(63, 2, 5,'Trash free');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(64, 2, 5,'Write/draw on chalkboard only');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(65, 2, 5,'Personal items are organized');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(66, 2, 5,'Keep room clean');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(67, 3, 5,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(68, 3, 5,'Knock politely to get staffs attention');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(69, 3, 5,'Use appropriate language and tone');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(70, 3, 5,'Quiet voices');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(71, 3, 5,'Avoid distracting others');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(72, 1, 6,'Stay seated');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(73, 1, 6,'Appropriate physical contact');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(74, 1, 6,'Be visible to staff');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(75, 1, 6,'Contraband free');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(76, 2, 6,'Look presentable');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(77, 2, 6,'Communicate only with visitor');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(78, 2, 6,'Engage with visitor');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(79, 3, 6,'Use appropriate language');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(80, 3, 6,'Listen to visitor');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(81, 3, 6,'Use appropriate volume and tone of voice');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(82, 1, 7,'Remain seated');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(83, 1, 7,'Take shoes off in nurses station');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(84, 1, 7,'Maintain personal boundaries');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(85, 1, 7,'Notify staff when feeling unsafe');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(86, 2, 7,'Answer questions honestly');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(87, 2, 7,'Follow treatment plan');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(88, 2, 7,'Positively participate in healthcare');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(89, 3, 7,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(90, 3, 7,'Use appropriate language');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(91, 3, 7,'Listen');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(92, 3, 7,'Be open to feedback');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(93, 3, 7,'Be open to learning');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(94, 1, 8,'Sit in assigned chair');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(95, 1, 8,'Stay seated');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(96, 1, 8,'Sit up straight');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(97, 1, 8,'Stay calm');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(98, 1, 8,'Keep hands and feet to self');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(99, 2, 8,'Ask questions if you don\'t understand'); -- rephrase?
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(100, 2, 8,'Be honest');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(101, 2, 8,'Accept consequences');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(102, 3, 8,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(103, 3, 8,'Refer to the Judge as "Your Honor"');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(104, 3, 8,'Wait for turn to speak');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(105, 3, 8,'Listen to others speak');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(106, 1, 9,'Use for intended purpose');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(107, 1, 9,'Always wash and dry hands');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(108, 1, 9,'Report damage and unsafe conditions to staff');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(109, 2, 9,'Use hygiene items appropriately');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(110, 2, 9,'Wear shower shoes');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(111, 2, 9,'Bring out clothing and hygiene items when done');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(112, 2, 9,'Be aware of time');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(113, 3, 9,'Flush toilet after using');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(114, 3, 9,'Clean up after self');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(115, 3, 9,'Use toilet appropriately');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(116, 3, 9,'Be mindful of others');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(117, 1, 10,'Keep hands and feet to self');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(118, 1, 10,'Disclose contraband');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(119, 2, 10,'Answer questions honestly');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(120, 2, 10,'Communicate only with current officer');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(121, 2, 10,'Ask questions if you don\'t understand'); -- rephrase?

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(122, 3, 10,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(123, 3, 10,'Be patient');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(124, 3, 10,'Use appropriate language');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(125, 3, 10,'Use manners');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(126, 3, 10,'Use indoor voice');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(127, 1, 11,'Remain searted');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(128, 1, 11,'Maintain personal boundaries');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(129, 1, 11,'Notify staff when feeling unsafe');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(130, 2, 11,'Answer questions honestly');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(131, 2, 11,'Participate in activities');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(132, 2, 11,'Follow directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(133, 2, 11,'Be open to learn');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(134, 3, 11,'Be respectful');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(135, 3, 11,'Use appropriate language');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(136, 3, 11,'Ask clarifying questions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(137, 3, 11,'Listen');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(138, 1, 12,'Follow staff directions');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(139, 1, 12,'Keep hands and feet to self');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(140, 1, 12,'Remain still');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(141, 2, 12,'Remain quiet');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(142, 2, 12,'Set a positive example');

insert into Behaviors(Id, CategoryId, LocationId, Description)
values(143, 3, 12,'Listen to instruction');
insert into Behaviors(Id, CategoryId, LocationId, Description)
values(144, 3, 12,'Wait to ask questions');