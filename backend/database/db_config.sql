-- reset reward claims and point assignments
drop table if exists Transactions;
drop table if exists RewardClaim;
drop table if exists PointAssignment;
drop table if exists PointChange;

-- reset person/reward tables
drop table if exists Rewards;
drop table if exists RewardCategory;
drop table if exists JuvenileEvent;
drop table if exists Juvenile;

-- reset behaviors
drop table if exists Behaviors;
drop table if exists Location;
drop table if exists BehaviorCategory;


-- relations for corresponding parties
create table Juvenile (
	Id integer primary key,
    FirstName varchar(100) not null,
    LastName varchar(100) not null
);

create table JuvenileEvent (
	Id integer primary key,
    JuvenileId integer,
    Active boolean not null,
    TotalPoints integer default 0,
    EDateTime datetime not null, -- used to determine the most recent event id for a given juvenile
    foreign key (JuvenileId) references Juvenile(Id)
);


-- definition of rewards and their specifications
create table RewardCategory (
	Id integer primary key,
    Description varchar(100)
);

create table Rewards (
	Id integer,
    Item varchar(100) not null,
	Category integer,
    Price integer not null,
    MaxQuantity integer not null,
    Image varchar(100) not null,
    primary key (Id, Category),
    foreign key (Category) references RewardCategory(Id)
);

-- definition of behaviors and their specifications
create table Location (
	Id integer primary key,
    Name varchar(100) not null
);

create table BehaviorCategory (
	Id integer primary key,
    Name varchar(100) not null
);

create table Behaviors (
	Id integer primary key,
    CategoryId integer,
    LocationId integer,
    Description varchar(200) not null,
    foreign key (CategoryId) references BehaviorCategory(Id),
    foreign key (LocationId) references Location(Id)
);


-- relations to track gaining and spending points
create table PointAssignment (
	JuvenileId integer,
	OfficerName varchar(50),
    Behavior integer,
	ADateTime datetime,
	primary key (OfficerName, JuvenileId, ADateTime),
    foreign key (JuvenileId) references Juvenile(Id),
    foreign key (Behavior) references Behaviors(Id)
);

create table RewardClaim (
	Id integer primary key,
    JuvenileId integer,
	OfficerName varchar(50),
	Points int not null,
	CDateTime datetime,
    foreign key (JuvenileId) references Juvenile(Id)
);

create table Transactions (
	ClaimId integer,
    RewardId integer,
    Quantity integer not null,
    Subtotal integer not null,
    primary key (ClaimId, RewardId),
    foreign key (ClaimId) references RewardClaim(Id),
    foreign key (RewardId) references Rewards(Id)
);

create table PointChange (
	AdminName varchar(50),
    JuvenileId integer,
    Points integer not null,
    PDateTime datetime not null,
	primary key(AdminName, JuvenileId, PDateTime),
    foreign key (JuvenileId) references Juvenile(Id)
);