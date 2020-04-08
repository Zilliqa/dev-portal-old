/*
 * Zilliqa Staking Calculator Plugin
 * Mar 2020
 */
(function(window) {
    'use strict';

    const DAYS_OPERATION_DIV_ID = "days";
    const STAKED_AMOUNT_DIV_ID = "stakedAmount";
    const REWARDS_LABEL_ID = "rewards-label";
    const REWARDS_TEXT_ID = "rewards"
    const REWARDS_CONTAINER_ID = "rewards-container";

    const DAYS_OPERATION_LABEL = "Days of Operation";
    const STAKED_AMOUNT_LABEL = "Staked amount ($ZIL)";
    const REWARDS_LABEL = "Est. rewards accumulated ($ZIL)";

    const REWARD_CYCLE = 15;
    const REWARD_FREQUENCY = 24;
    const ANNUAL_INTEREST_RATE = 10.42 / 100; // percent
    const PER_CYCLE_INTEREST_RATE = 0.0285479 / 100; // percent
    const MIN_STAKE_AMOUNT = 10000000;

    const DAYS_OPERATION_ERROR_MSG = "ERROR: minimum days of operation is 0.";
    const STAKED_AMOUNT_ERROR_MSG = "ERROR: minimum staked amount is " + Number((MIN_STAKE_AMOUNT).toFixed(2)).toLocaleString('en-US') + " ZIL.";

    function stakingCalculator() {
        var _calculatorObject = {};
        var defaults = {
            containerID: "staking-calculator"
        };

        _calculatorObject.setContainerID = function (containerID) {
            console.log("update: %o", containerID);
            defaults.containerID = containerID;
            return containerID;
        }

        _calculatorObject.update = function () {
            console.log(defaults.containerID);
            document.getElementById(defaults.containerID).innerHTML = "<p>abcdefgh</p>";    
        }

        // initialize the form
        _calculatorObject.init = function () {
            var container = document.getElementById(defaults.containerID);

            var header = document.createElement("h4");
            header.innerHTML = "ZILLIQA SSN REWARD CALCULATOR";
            container.appendChild(header);

            var message = document.createElement("p");
            setAttributes(message, {"id": "staking-message"});
            container.appendChild(message);

            var formObject = document.createElement("form");
            formObject.setAttribute("action", "");

            // Create days of operation label
            var daysLabel = document.createElement("label");
            setAttributes(daysLabel, {
                "for": DAYS_OPERATION_DIV_ID
            });
            daysLabel.innerHTML = DAYS_OPERATION_LABEL + ":";
            formObject.appendChild(daysLabel);

            // Create days of operation input
            var daysInput = document.createElement("input");
            setAttributes(daysInput, {
                "type": "text",
                "name": DAYS_OPERATION_DIV_ID,
                "id": DAYS_OPERATION_DIV_ID,
                "value": "0"
            });

            daysInput.addEventListener('input', function() {
                var operationalDays = document.getElementById("days").value;
                var stakedAmount = document.getElementById("stakedAmount").value.replace(/,/g, '');

                if (isNaN(operationalDays)) {
                    message.innerHTML = DAYS_OPERATION_ERROR_MSG;
                    return;
                } else {
                    message.innerHTML = '';
                }

                if (operationalDays === '') {
                    document.getElementById("days").value = 0;
                }

                var rewards = calculateRewards(message, operationalDays, stakedAmount);

                document.getElementById("rewards").innerHTML = Number((rewards).toFixed(2)).toLocaleString('en-US');
            }, false);

            formObject.appendChild(daysInput);

            // Insert linebreak
            insertLineBreak(formObject);

            // Create staked amount label
            var stakedLabel = document.createElement("label");
            setAttributes(stakedLabel, {
                "for":STAKED_AMOUNT_DIV_ID
            });
            stakedLabel.innerHTML = STAKED_AMOUNT_LABEL + ":";
            formObject.appendChild(stakedLabel);

            // Create staked amount input
            var stakedInput = document.createElement("input");
            setAttributes(stakedInput, {
                "type": "text",
                "name": STAKED_AMOUNT_DIV_ID,
                "id": STAKED_AMOUNT_DIV_ID,
                "value": Number((MIN_STAKE_AMOUNT).toFixed(2)).toLocaleString('en-US')
            });

            stakedInput.addEventListener('input', function() {
                var operationalDays = document.getElementById("days").value;
                var stakedAmount = document.getElementById("stakedAmount").value.replace(/,/g, '');

                var rewards = calculateRewards(message, operationalDays, stakedAmount);

                // format the staked amount display to seperate the hundreds and thousands
                document.getElementById(STAKED_AMOUNT_DIV_ID).value = (parseInt(stakedAmount) || MIN_STAKE_AMOUNT).toLocaleString('en-US');

                document.getElementById("rewards").innerHTML = Number((rewards).toFixed(2)).toLocaleString('en-US');
            }, false);

            formObject.appendChild(stakedInput);

            // Insert linebreak
            insertLineBreak(formObject);

            var rewardsLabel = document.createElement("p");
            var node = document.createTextNode(REWARDS_LABEL);
            rewardsLabel.appendChild(node);
            setAttributes(rewardsLabel, {"id": REWARDS_LABEL_ID});

            var rewardsInput = document.createElement("span");
            var node = document.createTextNode(0);
            rewardsInput.appendChild(node);
            setAttributes(rewardsInput, {"id": REWARDS_TEXT_ID});

            var rewardsContainer = document.createElement("div");
            setAttributes(rewardsContainer, {"id" : REWARDS_CONTAINER_ID});
            rewardsLabel.appendChild(rewardsInput);
            rewardsContainer.appendChild(rewardsLabel);
            
            formObject.appendChild(rewardsContainer);

            // Insert linebreak
            insertLineBreak(formObject);

            // Create help tooltip
            var helpContainer = document.createElement("div");
            setAttributes(helpContainer, {"class": "help-container"});
            helpContainer.innerHTML = "How are my rewards calculated?";
        
            var helpTooltip = document.createElement("span");
            setAttributes(helpTooltip, {"class": "help-tooltiptext"});
            helpTooltip.innerHTML = "Rewarding cycle: " + REWARD_CYCLE + " DS epochs" + 
             "\<br\>Est. rewarding frequency: " + REWARD_FREQUENCY + " hours" +
             "\<br\>Annual interest rate: " + ANNUAL_INTEREST_RATE * 100 + "%" +
             "\<br\>Interest rate per rewarding cycle: " + PER_CYCLE_INTEREST_RATE * 100 + "%" +
             "\<br\>Minimum stake amount: " + Number((MIN_STAKE_AMOUNT).toFixed(2)).toLocaleString('en-US') + " ($ZIL)" +
             "\<br\>" +
             "\<br\>Rewards: number of days x staked amount x interest rate per reward cycle"
            helpContainer.appendChild(helpTooltip);
            formObject.appendChild(helpContainer);

            // Create reset button
            // Create button
            var resetBtn = document.createElement("button");
            setAttributes(resetBtn, {
                "type": "button",
                "id": "resetBtn"
            });
            resetBtn.innerHTML = "Clear";

            resetBtn.addEventListener('click', function() {
                document.getElementById("days").value = 0;
                document.getElementById("stakedAmount").value = Number((MIN_STAKE_AMOUNT).toFixed(2)).toLocaleString('en-US');
                document.getElementById("rewards").innerHTML = 0;
                message.innerHTML = '';
            }, false);

            formObject.appendChild(resetBtn);
            container.appendChild(formObject);
        }

        return _calculatorObject;
    }

    // helper function to set attributes easily
    function setAttributes(elem, attrs) {
        for(var key in attrs) {
            elem.setAttribute(key, attrs[key]);
        }
    }

    function insertLineBreak(elem) {
        var linebreak = document.createElement("br");
        elem.appendChild(linebreak);
    }

    function createParagraph(elem, text) {
        var paragraph = document.createElement("p");
        var node = document.createTextNode(text);
        paragraph.appendChild(node);
        elem.appendChild(paragraph);
    }

    function calculateRewards(message, days, stakedAmount) {
        var rewards = 0;
        if (isNaN(days)) {
            message.innerHTML = DAYS_OPERATION_ERROR_MSG;
            return rewards;
        } else if (isNaN(stakedAmount) || stakedAmount < MIN_STAKE_AMOUNT) {
            message.innerHTML = STAKED_AMOUNT_ERROR_MSG;
            return rewards;
        }
        message.innerHTML = '';
        return parseInt(days) * parseInt(stakedAmount) * PER_CYCLE_INTEREST_RATE;
    }

    if (typeof(window.stakingCalculator) === 'undefined') {
        window.stakingCalculator = stakingCalculator();
    }
}(window));

stakingCalculator.init();