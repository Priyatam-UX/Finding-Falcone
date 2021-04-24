var app = app || {};

(function () {
    var { utils, models } = app;
    function init() {
        models.getPlanets().then(data => {
            utils.planetsSetEvent(onPlanetSelect);
            utils.populatePlanets(data);
        });
        utils.setEventFind(getToken);

    }

    function onPlanetSelect(destinationName, planetName) {
        // debugger;
        utils.clearVehicles(destinationName);
        models.getVehicles().then((data) => {
            models.updatePlanet(destinationName, planetName);
            utils.populateVehicles(data);
            reRender();
        });
        utils.markSelectedPlanet(destinationName, planetName);
    }

    function onVehicleSelect(destination, vehicle, planet) {
        models.updateVehicleNumber(destination, vehicle, planet);
        utils.calculateTotalTime(models.getCurrentState());
        reRender();
    }

    function reRender() {
        utils.clearEvents();
        utils.renderState(models.getCurrentState());
        utils.setUpEventHandlersForVehicle(onVehicleSelect);
        utils.displayTotalTime();

    }

    function getToken() {
        models.postFunction().then(token => {
            models.updateRequestBody(token, models.getCurrentState());
            models.findFalcone().then(data => {

                // console.log(data);
                if (data.status === 'success') {
                    window.alert(`Falcone found in ${data.planet_name}!!!`);
                }
                else {
                    window.alert("Try Again");
                }
            });
        })

    }

    init();
})(app); 