var app = app || {};
app.utils = {};

(function (utils) {
    var $current; var selectedVehicle; var selectedPlanet; var total_time;

    utils.populatePlanets = function (data) {
        for (var key in data) {
            $('.planet').append(`<option value='${data[key].name}'>${data[key].name}</option>`);
        }
    }

    utils.markSelectedPlanet = function (destination, planet) {
        // $(`.${destination} option`).removeAttr('disabled')
        $(`option:contains('${planet}')`).attr("disabled", "disabled");

    }

    utils.planetsSetEvent = function (callback) {
        $('.planet').change(function () {
            $(this).parent().children(".vehicle").remove();
            $(this).parent().append(`<div class= 'vehicle'></div>`);
            $current = $(this).parent().children('.vehicle');
            destinationName = $(this).parent()[0].className;
            callback(destinationName, $(this).val());
        });
    }

    utils.populateVehicles = function (data) {
        $current.empty();
        for (var key in data) {
            if (data[key].total_no === -1) {
                $current.append(`<input type='radio' value='${data[key].name}' disabled>${data[key].name}(${data[key].total_no})<br>`);
            }
            else {
                $current.append(`<input type='radio' value='${data[key].name}'>${data[key].name}(${data[key].total_no})<br>`);
            }
        }
    }

    utils.setUpEventHandlersForVehicle = function (callback) {
        $('.vehicle input').on('click', function () {
            $(this).parent().children('input').prop("checked", false); //uncheck all other radio buttons
            $(this).parent().children('input').removeClass('selected'); // remove selected class
            $(this).addClass('selected');
            $('.selected').prop("checked", true);
            if (!$(this).parent().parent()[0]) {
                return;
            }
            selectedPlanet = $(this).parent().parent()[0].className;
            selectedVehicle = $(this)[0].defaultValue;
            callback(selectedPlanet, selectedVehicle);
        });
    }
    utils.clearEvents = function () {
        $('.vehicle input').off("click");
    }

    utils.clearVehicles = function (destinationName) {
        $("." + destinationName).children('.vehicle').empty()
    };

    utils.renderState = function (data) {
        for (var destinationName in data) {
            var destinationDetails = data[destinationName];
            let $el = $("." + destinationName).children('.vehicle');
            utils.clearVehicles(destinationName);
            destinationDetails.vehiclesList.forEach(vehicleDetails => {
                let isVehicleSelected = destinationDetails.selectedVehicle ?
                    destinationDetails.selectedVehicle.name == vehicleDetails.name : false;
                let { name, total_no } = vehicleDetails;
                var input = `<input type='radio' name='${destinationName}' value='${name}'`
                if (isVehicleSelected) {
                    input += " checked "
                }
                if (total_no === -1) {
                    input += " disabled"
                    input += `><span>${name}(0)</span> <br>`;
                }
                else {
                    input += `><span>${name}(${total_no})</span> <br>`;
                }

                $el.append(input);
            });
        }
    }

    utils.calculateTotalTime = function (state) {
        let distance, speed, time;
        total_time = 0;
        for (var key in state) {
            if (state[key].selectedPlanet != null && state[key].selectedVehicle != null) {
                distance = state[key].selectedPlanet.distance;
                speed = state[key].selectedVehicle.speed;
                time = distance / speed;
                total_time += time;
            }
        }
    }

    utils.displayTotalTime = function () {
        $('.timeTaken').text(total_time);
    }

    utils.setEventFind = function (callback) {
        $('.find-btn').on('click', callback)
    }


})(app.utils);
