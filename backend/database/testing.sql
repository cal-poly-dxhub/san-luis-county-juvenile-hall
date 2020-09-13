-- populate Juvenile table
insert into Juvenile(Id, FirstName, LastName, TotalPoints)
values (12345, 'James', 'Philburn', 150);
insert into Juvenile(Id, FirstName, LastName, TotalPoints)
values (12346, 'Antonio', 'Jackson', 150);


-- populate JuvenileEvent table
insert into JuvenileEvent(Id, JuvenileId, Active, EDateTime)
values (10001, 12345, 1, now());
insert into JuvenileEvent(Id, JuvenileId, Active, EDateTime)
values (10002, 12346, 1, now());
