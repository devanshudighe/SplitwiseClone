use splitwise;
-------------------------------------------------------------------------------------
DROP Procedure if EXISTS  `getUserInfo`;
DELIMITER ;;
CREATE PROCEDURE `getUserInfo` (_email varchar(50))
BEGIN
SELECT user_id,name,email,password,phone,currency,language,timeZone,imageInfo  FROM UserDetails WHERE email = _email;
END;;
DELIMITER ;
-------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `storeUserInfo`;
DELIMITER ;;
CREATE PROCEDURE `storeUserInfo`(_email varchar(50), _name varchar(50), _password varchar(50))
BEGIN
    IF NOT EXISTS(SELECT email from UserDetails WHERE email = _email) THEN
        INSERT INTO UserDetails (`name`, email, `password`, currency,language,timeZone,imageInfo) VALUES (_name, _email, _password,"USD","en","America/Los_Angeles","userPlaceholder.png") ;
        SELECT 1 as flag ;
    ELSE
        SELECT 0 as flag ;
    END IF ;
END ;;
DELIMITER ;
-------------------------------------------------------------------------------------
/* Update User Profile*/
DROP PROCEDURE IF EXISTS `updateUserInfo`;
DELIMITER ;;
CREATE PROCEDURE `updateUserInfo` (userId bigint, uName varchar(50), uEmail varchar(50),  uCurrency varchar(50), uLanguage varchar(50),uPhone bigint, uTimezone varchar(50))
BEGIN
UPDATE UserDetails
SET 
    name = uName,
    email = uEmail,
    phone = uPhone,
    currency = uCurrency,
    language = uLanguage,
    Timezone = uTimezone
WHERE user_id = userId;
-- COMMIT ;
-- SELECT imageInfo from UserDetails WHERE user_id = userId ;
END;;
DELIMITER ;
-------------------------------------------------------------------------------------
/* Get Updated User info */
DROP PROCEDURE IF EXISTS `getUpdatedUserInfo`;
DELIMITER ;;
CREATE PROCEDURE `getUpdatedUserInfo` (userId bigint)
BEGIN
SELECT user_id,name,email,password,phone,currency,language,Timezone,imageInfo
FROM UserDetails 
WHERE userId = user_id;
END;;
DELIMITER ;
-------------------------------------------------------------------------------------
/*Store Group info*/
DELIMITER ;;
DROP TABLE IF EXISTS `UserGroupInfo`;
CREATE TABLE UserGroupInfo (
    user_group_id int AUTO_INCREMENT,
    group_id int NOT NULL,
    user_id bigint(10) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES UserDetails (user_id),
    FOREIGN KEY (group_id) REFERENCES GroupInfo (group_id),
    -- group_name varchar(50) NOT NULL UNIQUE,
    is_member varchar(1) NOT NULL,
    -- group_image varchar(255),
    PRIMARY KEY(user_group_id)
);
-------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `createGroup`;
DELIMITER ;;
CREATE PROCEDURE `createGroup` (
    in_user_id BIGINT,
    in_group_name VARCHAR(50),
    in_group_image VARCHAR(255)
)
BEGIN
    DECLARE _group_id INT;
    IF EXISTS(SELECT group_name FROM GroupInfo WHERE group_name = TRIM(in_group_name)) THEN
        SELECT 'Group_exists' AS flag;
        -- SELECT group_id INTO _group_id FROM groups WHERE group_name = TRIM(in_group_name);
        -- INSERT INTO groups_users (group_id, user_id, is_member) VALUES(_group_id, in_user_id, 'Y');
    ELSE
        INSERT INTO GroupInfo (group_name, group_image) VALUES (in_group_name, in_group_image);
        SELECT group_id INTO _group_id FROM GroupInfo WHERE group_name = in_group_name;
        INSERT INTO UserGroupInfo (user_id, group_id, is_member) VALUES (in_user_id, _group_id, 'Y');
        SELECT 'Created_Group' AS flag;
    END IF;
END;;
DELIMITER ;
-------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `newMemberInvitation`;
DELIMITER ;;
CREATE PROCEDURE `newMemberInvitation` (
    in_email VARCHAR(50),
    in_group_name VARCHAR(50)
)
storedProc: BEGIN
    DECLARE _group_id INT;
    DECLARE _user_id BIGINT;
    IF EXISTS(SELECT user_id FROM UserDetails WHERE email = in_email) 
    THEN
        SELECT user_id INTO _user_id FROM UserDetails WHERE email = in_email;
    ELSE
        SELECT "MEMBER_DOES_NOT_EXIST" AS flag;
        LEAVE storedProc;
    END IF;

    IF EXISTS(SELECT group_name FROM GroupInfo WHERE group_name = TRIM(in_group_name)) THEN
            SELECT group_id INTO _group_id FROM GroupInfo WHERE group_name = in_group_name;
    ELSE
        SELECT 'GROUP_DOES_NOT_EXIST' AS flag;
        LEAVE storedProc;
    END IF;
    
    IF EXISTS(SELECT user_id FROM UserGroupInfo WHERE user_id = _user_id AND group_id = _group_id) THEN
        SELECT "MEMBER_ALREADY_INVITED" AS flag;
    ELSE
        INSERT INTO UserGroupInfo (user_id, group_id, is_member) VALUES (_user_id, _group_id, 'N');
        SELECT "MEMBER_INVITED" AS flag;
    END IF;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `groupInvitationDashboard`;
DELIMITER ;;
CREATE PROCEDURE `groupInvitationDashboard` (
    in_user_id BIGINT
)
BEGIN
    SELECT group_name, group_image, is_member
    FROM GroupInfo JOIN UserGroupInfo ON 
    GroupInfo.group_id = UserGroupInfo.group_id 
    WHERE UserGroupInfo.user_id = in_user_id;
    
END ;;
DELIMITER ;
-------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `groupInvitationAccepted`;
DELIMITER ;;
CREATE PROCEDURE `groupInvitationAccepted` (
    in_user_id BIGINT,
    in_group_name VARCHAR(50)
    -- in_group_image VARCHAR(255)
)
BEGIN
    
    UPDATE UserGroupInfo SET is_member = 'Y' WHERE user_id = in_user_id AND group_id = (
        SELECT group_id from GroupInfo WHERE group_name = in_group_name
    );
    SELECT "MEMBER_ACCEPTED" AS flag;
    
END ;;
DELIMITER ;
-------------------------------------------------------------------------------------
/*Creating table for User Billing details for activities*/
DROP TABLE IF EXISTS UserBillDetails;
CREATE TABLE UserBillDetails(
    bill_id INT AUTO_INCREMENT,
    bill_details varchar(50) NOT NULL,
    group_id INT,
    bill_paid_by BIGINT,
    bill_amount INT NOT NULL,
    bill_add_time timestamp NOT NULL,
    PRIMARY KEY(bill_id),
    FOREIGN KEY (bill_paid_by) REFERENCES UserDetails (user_id),
    FOREIGN KEY (group_id) REFERENCES GroupInfo (group_id)
);
-------------------------------------------------------------------------------------
/*Creating table for groups and users along with the bill split amounts*/
DROP TABLE IF EXISTS UserBillSplit;
CREATE TABLE UserBillSplit(
    transaction_id INT(10) NOT NULL AUTO_INCREMENT,
    bill_id INT(10) NOT NULL,
    user_id BIGINT(10) NOT NULL,
    owed_id BIGINT(10) NOT NULL,
    amount DOUBLE NOT NULL,
    -- `settle` VARCHAR(1),
    -- `split_amount` INT(10) NOT NULL,
    -- `bill_created_at` TIMESTAMP NOT NULL,
    PRIMARY KEY (`transaction_id`),
    -- FOREIGN KEY (`bill_id`) REFERENCES `bills`(`bill_id`),
    FOREIGN KEY (user_id) REFERENCES UserDetails (user_id),
    FOREIGN KEY (owed_id) REFERENCES UserDetails (user_id)
);

-------------------------------------------------------------------------------------
/*Procedure for adding a bill by a user*/
DROP PROCEDURE IF EXISTS `AddUserBill`;
DELIMITER ;;
CREATE PROCEDURE AddUserBill (
    in_group_name VARCHAR(50) ,
    in_bill_name VARCHAR(255),
    in_bill_paid_by INT,
    in_bill_amount DOUBLE
)
BEGIN
    DECLARE _bill_id INT;
    DECLARE _group_id BIGINT;

    SELECT group_id INTO _group_id from GroupInfo where group_name = in_group_name;

    INSERT INTO UserBillDetails (group_id, bill_details, bill_paid_by, bill_amount, bill_add_time) 
    VALUES (_group_id,in_bill_name,in_bill_paid_by,in_bill_amount,NOW());

    SELECT max(bill_id) INTO _bill_id FROM UserBillDetails WHERE bill_details = in_bill_name;

    INSERT INTO UserBillSplit ( bill_id, user_id, owed_id, amount,settled)
    SELECT b.bill_id,
            b.bill_paid_by AS user_id,
            b1.owed_id AS owed_id,
            (b.bill_amount / b2.no_of_users) AS amount,
            'N' as settled
    FROM UserBillDetails b 
    JOIN (
        SELECT count(gu.user_id) AS no_of_users, 
                b.group_id, 
                b.bill_id
        FROM UserBillDetails b 
        JOIN UserGroupInfo gu
        ON b.group_id = gu.group_id 
        AND gu.is_member = 'Y'
        GROUP BY b.group_id, b.bill_id
    ) b2 
    ON b.group_id = b2.group_id 
    AND b.bill_id = b2.bill_id
    JOIN
    (
        SELECT user_id AS owed_id, 
                UserBillDetails.bill_id
        FROM UserBillDetails 
        JOIN UserGroupInfo 
        ON UserBillDetails.group_id = UserGroupInfo.group_id 
        AND UserBillDetails.bill_paid_by <> UserGroupInfo.user_id
        AND UserGroupInfo.is_member = 'Y'
    ) b1 
    ON b.bill_id = b1.bill_id
    WHERE b.bill_id = _bill_id;

    SELECT "BILL_ADDED" AS flag;

END ;;
DELIMITER ;
-------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `Get_Group_Details`;
DELIMITER ;;
CREATE PROCEDURE `Get_Group_Details` (
    in_user_id INT,
    in_group_name VARCHAR(255)
)
BEGIN
    SELECT b.bill_id, 
            b.bill_details,
            b.bill_amount, 
            g.group_name, 
            b.bill_paid_by, 
            paid_by.name as paid_by_name,
            gu.user_id,
            u.name,
            CASE 
                WHEN gu.user_id = b.bill_paid_by 
                THEN 'GET' 
                ELSE 'PAY' 
            END AS pay_get, 
            CASE 
                WHEN gu.user_id = b.bill_paid_by 
                THEN (b.bill_amount / gu_count.no_of_users) *  (gu_count.no_of_users - 1)
                ELSE (b.bill_amount / (gu_count.no_of_users))
            END AS split_amount,
            b.bill_add_time
    FROM UserBillDetails b
    LEFT JOIN GroupInfo g ON b.group_id = g.group_id
    LEFT JOIN UserGroupInfo gu ON b.group_id = gu.group_id
    LEFT JOIN UserDetails u ON gu.user_id = u.user_id 
    LEFT JOIN (
        SELECT count(user_id) AS no_of_users,
                group_id
        FROM UserGroupInfo gu
        WHERE gu.is_member = 'Y'
        GROUP BY group_id
    ) gu_count ON b.group_id = gu_count.group_id
    LEFT JOIN (
        SELECT DISTINCT b.bill_paid_by, 
                u.name 
        FROM UserDetails u JOIN UserBillDetails b ON u.user_id = b.bill_paid_by
    ) paid_by ON b.bill_paid_by = paid_by.bill_paid_by
    WHERE u.user_id = in_user_id
    AND g.group_name = in_group_name
    ORDER BY b.bill_add_time DESC ;
END ;;
DELIMITER ;
-------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `recentActivity`;
DELIMITER ;;
CREATE PROCEDURE `recentActivity`(
    in_user_id BIGINT
)
BEGIN
    SELECT 
        b.bill_id, 
        b.bill_details,
        b.bill_amount, 
        g.group_name, 
        b.bill_paid_by, 
        paid_by.name as paid_by_name,
        gu.user_id,
        u.name,
        CASE 
            WHEN gu.user_id = b.bill_paid_by 
            THEN 'GET' 
            ELSE 'PAY' 
        END AS pay_get, 
        CASE 
            WHEN gu.user_id = b.bill_paid_by 
            THEN (b.bill_amount / gu_count.no_of_users) *  (gu_count.no_of_users - 1)
            ELSE (b.bill_amount / (gu_count.no_of_users))
        END AS split_amount,
        b.bill_add_time
    FROM UserBillDetails b
    LEFT JOIN GroupInfo g ON b.group_id = g.group_id
    LEFT JOIN UserGroupInfo gu ON b.group_id = gu.group_id
    LEFT JOIN UserDetails u ON gu.user_id = u.user_id 
    LEFT JOIN (
        SELECT count(user_id) AS no_of_users,
                group_id
        FROM UserGroupInfo gu
        GROUP BY group_id
    ) gu_count ON b.group_id = gu_count.group_id
    LEFT JOIN (
        SELECT DISTINCT b.bill_paid_by, 
                u.name 
        FROM UserDetails u JOIN UserBillDetails b ON u.user_id = b.bill_paid_by
    ) paid_by ON b.bill_paid_by = paid_by.bill_paid_by
    WHERE u.user_id = in_user_id
    ORDER BY b.bill_add_time DESC ;
END ;;
DELIMITER ;

-------------------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `get_balances`;
DELIMITER ;;
CREATE PROCEDURE `get_balances` (
    in_user_id INT,
    in_owed_id INT
)
BEGIN
    SELECT 
        final2.logged_in_user,
        MAX(CASE WHEN final2.logged_in_user=u.user_id THEN u.name END) AS logged_in_user_name,
        final2.checking_with_user,
        MAX(CASE WHEN final2.checking_with_user=u.user_id THEN u.name END) AS checking_with_user_name,
        CASE 
            WHEN final2.net_amt > 0 THEN 'COLLECT' 
            WHEN final2.net_amt < 0 THEN 'PAY' 
            ELSE 'SETTLED'
            END AS collect_or_pay,
        final2.net_amt
    FROM (
        SELECT 
            CASE WHEN net_amt > 0 THEN s1_user_id ELSE s2_owed_id END AS logged_in_user,
            -- u.name AS logged_in_user_name,
            CASE WHEN net_amt > 0 THEN s1_owed_id ELSE s2_user_id END AS checking_with_user,
            -- CASE WHEN net_amt > 0 THEN 'COLLECT' ELSE 'PAY' END AS collect_or_pay,
            net_amt
        FROM (
            SELECT 
                s1.user_id as s1_user_id,
                s1.owed_id as s1_owed_id,
                s2.user_id as s2_user_id, 
                s2.owed_id as s2_owed_id,
                s1.collect_amount - s2.owed_amount as net_amt
            FROM (
                SELECT 
                IFNULL(sum(amount),0) AS collect_amount, user_id, owed_id
                FROM UserBillSplit
                WHERE user_id=in_user_id AND owed_id=in_owed_id
            ) AS s1 
            JOIN (
                SELECT IFNULL(sum(amount),0) AS owed_amount, user_id, owed_id
                FROM UserBillSplit
                WHERE user_id=in_owed_id AND owed_id=in_user_id
            ) AS s2
        ) AS final
    ) AS final2
    JOIN UserDetails u 
    WHERE final2.logged_in_user IS NOT NULL
    GROUP BY
    final2.logged_in_user,
    final2.checking_with_user,
    CASE 
        WHEN final2.net_amt > 0 THEN 'COLLECT' 
        WHEN final2.net_amt < 0 THEN 'PAY' 
        ELSE 'SETTLED'
        END,
    final2.net_amt;
END ;;
DELIMITER ;
-----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `settle_up`;
DELIMITER ;;
CREATE PROCEDURE `settle_up` (
    in_user_id INT,
    in_owed_name VARCHAR(255),
    in_settle_amount DOUBLE
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE _bill_id, _user_id, in_owed_id, _owed_id INT;

    DECLARE c1 CURSOR FOR (
        SELECT final.bill_id, final.user_id, final.owed_id FROM (
            (SELECT
                bt.bill_id,
                bt.user_id,
                bt.owed_id
                FROM UserBillSplit bt
                WHERE bt.user_id=in_user_id AND bt.owed_id=in_owed_id)
            UNION ALL
            (SELECT
                bt.bill_id,
                bt.user_id,
                bt.owed_id
            FROM UserBillSplit bt
            WHERE bt.user_id=in_owed_id AND bt.owed_id=in_user_id) 
        ) AS final
    );

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SELECT u.user_id INTO in_owed_id FROM UserDetails u WHERE u.name = in_owed_name; 
    
    INSERT INTO UserBillSplit (bill_id, user_id, owed_id, amount) VALUES (-1, in_user_id, in_owed_id, in_settle_amount);

    OPEN c1;

    read_loop: LOOP
        FETCH c1 INTO _bill_id, _user_id, _owed_id;
        IF done THEN
            SELECT "SETTLED_UP" as flag;
            LEAVE read_loop;
        END IF;
        UPDATE UserBillSplit
        SET settled='Y'
        WHERE user_id=_user_id AND owed_id=_owed_id AND bill_id=_bill_id;
    END LOOP;
    
    CLOSE c1;

END ;;
DELIMITER ;
----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `Group_Member_Leave`;
DELIMITER ;;
CREATE PROCEDURE `Group_Member_Leave` (
    in_user_id INT,
    in_group_name VARCHAR(255)
)
sp: BEGIN
    
    DECLARE count_records INT;
    DECLARE _settled VARCHAR(3);

    SELECT COUNT(final2.settled) INTO count_records
    FROM (
        SELECT DISTINCT final.settled 
        FROM (
            SELECT 
                bt.settled 
            FROM UserBillSplit bt
            JOIN UserBillDetails b ON bt.bill_id=b.bill_id
            JOIN GroupInfo g ON b.group_id = g.group_id
            WHERE g.group_name = in_group_name AND bt.user_id=in_user_id
            UNION ALL 
            SELECT 
                bt.settled 
            FROM UserBillSplit bt
            JOIN UserBillDetails b ON bt.bill_id=b.bill_id
            JOIN GroupInfo g ON b.group_id = g.group_id
            WHERE g.group_name = in_group_name AND bt.owed_id=in_user_id
        ) AS final
    ) AS final2;


    IF count_records > 1 THEN
        SELECT 'NOT_SETTLED' AS flag;
        LEAVE sp;
    ELSE
        SELECT final2.settled INTO _settled 
        FROM (
            SELECT DISTINCT final.settled 
            FROM (
                SELECT 
                    bt.settled 
                FROM UserBillSplit bt
                JOIN UserBillDetails b ON bt.bill_id=b.bill_id
                JOIN GroupInfo g ON b.group_id = g.group_id
                WHERE g.group_name = in_group_name AND bt.user_id=in_user_id
                UNION ALL 
                SELECT 
                    bt.settled 
                FROM UserBillSplit bt
                JOIN UserBillDetails b ON bt.bill_id=b.bill_id
                JOIN GroupInfo g ON b.group_id = g.group_id
                WHERE g.group_name = in_group_name AND bt.owed_id=in_user_id
            ) AS final
        ) AS final2;

        IF _settled <> 'Y' THEN
            SELECT 'NOT_SETTLED' AS flag;
            LEAVE sp;
        ELSE
            UPDATE UserGroupInfo SET is_member = 'L' 
            WHERE user_id = in_user_id 
            AND group_id = (SELECT group_id 
                            FROM GroupInfo 
                            WHERE group_name = in_group_name);

            SELECT 'ALL_BALANCE_SETTLED' AS flag;
        END IF;
    END IF;
END ;;
DELIMITER ;
-------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `Group_Member_Invite_Reject`;
DELIMITER ;;
CREATE PROCEDURE `Group_Member_Invite_Reject` (
    in_user_id INT,
    in_group_name VARCHAR(255)
)
BEGIN
    
    UPDATE UserGroupInfo SET is_member = 'R' 
    WHERE user_id = in_user_id 
    AND group_id = (SELECT group_id 
                    FROM GroupInfo 
                    WHERE group_name = in_group_name);

    SELECT 'INVITE_REJECTED' AS flag;
    
END ;;
DELIMITER ;
----------------------------------------------------------------------------