var app = app || {};
app.models = {};

(function (models) {
    var planets, vehicle, originalVehicle;

    var destinations = ["destination1", "destination2", "destination3", "destination4"];

    // creating a variable to capture the current state
    var currentState = {
        destination1: {
            selectedPlanet: {
                name: "",
                distance: ""
            },
            selectedVehicle: {
                name: "",
                max_distance: "",
                speed: ""
            },
            vehiclesList: [
                {
                    name: "",
                    total_no: 0
                }
            ]
        },
        destination2: {
            selectedPlanet: null,
            selectedVehicle: null,
            vehiclesList: []
        },
        destination3: {
            selectedPlanet: null,
            selectedVehicle: null,
            vehiclesList: []
        },
        destination4: {
            selectedPlanet: null,
            selectedVehicle: null,
            vehiclesList: []
        }
    };

    // function to return current state
    models.getState = function () {
        return currentState;
    }

    //getting planets from json
    models.getPlanets = function () {
        if (planets) {
            return new Promise((resolve, reject) => {
                resolve(planets);
            })
        }
        return fetch('code/planet.json').then(function (response) {
            return response.json();
        }).then(data => {
            planets = data;
            originalPlanets = planets;
            return planets;
        }).catch(err=>window.alert(err));
    }

    //getting vehicles from json
    models.getVehicles = function () {
        if (vehicle) {
            return new Promise((resolve, reject) => {
                resolve(vehicle);
            })
        }
        return fetch('code/vehicle.json').then(function (response) {
            return response.json();
        }).then((data) => {
            vehicle = data;
            originalVehicle = JSON.parse(JSON.stringify(data)); // creating another copy of the data 
            return data;
        }).catch(err=>window.alert(err));
    }

    // post function to get the token
    models.postFunction = function () {
        return fetch('https://findfalcone.herokuapp.com/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((r) => { return r.json() })
        .catch(err=>window.alert(err));;
    }

    // creatin request body for findFalcone api request
    var requestBody = {
        "token": "",
        "planet_names": [],
        "vehicle_names": []
    }

    models.findFalcone = function () {
        return fetch("https://findfalcone.herokuapp.com/find", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then((r) => { return r.json() })
        .catch(err=>window.alert(err));
    }

    // update planets and rerender
    models.updatePlanet = function (destinationName, selectedPlanetName) {
        currentState[destinationName].selectedPlanet = getPlanetWithName(selectedPlanetName);
        recalculate();
    }

    models.updateVehicleNumber = function (destinationName, selectedVehicleName) {
        currentState[destinationName].selectedVehicle = getVehicleWithName(selectedVehicleName);
        recalculate();
        return;
    }

    getVehicleWithName = function (name) {
        let selected;
        vehicle.forEach((vehicle) => {
            if (vehicle.name == name) {
                selected = vehicle;
            }
        });
        return selected;
    }

    getPlanetWithName = function (name) {
        let selected;
        planets.forEach((planet) => {
            if (planet.name == name) {
                selected = planet;
            }
        });
        return selected;
    }

    models.getCurrentState = function () {
        return currentState;
    }

    function recalculate() {
        clearVehiclesListInCurrentState();
        let vehicles = JSON.parse(JSON.stringify(originalVehicle));
        vehicles.forEach((vehicle) => {
            destinations.forEach((destinationName) => {
                if (isVehicleNameSelectedInDestination(vehicle.name, destinationName) && vehicle.total_no != -1) {
                    vehicle.total_no--;
                };

                addtoVehicleList(destinationName, {
                    name: vehicle.name,
                    total_no: vehicle.total_no
                })
            })
        });

    }

    function isVehicleNameSelectedInDestination(vehicleName, destinationName) {
        if (!currentState[destinationName].selectedVehicle) {
            return false;
        }
        return currentState[destinationName].selectedVehicle.name === vehicleName;
    }
    function clearVehiclesListInCurrentState() {
        for (key in currentState) {
            currentState[key].vehiclesList = [];
        }
    }

    function addtoVehicleList(destinationName, vehicleDetails) {
        currentState[destinationName]["vehiclesList"].push(vehicleDetails);
    }

    models.updateRequestBody = function (data, state) {
        //updating token
        requestBody.token = data.token;
        requestBody.planet_names = [];
        requestBody.vehicle_names = [];
        for (var destination in state) {
            //updating planet names
            requestBody.planet_names.push(state[destination].selectedPlanet.name);
            //update vehicle name
            requestBody.vehicle_names.push(state[destination].selectedVehicle.name);
        }
        // console.log(requestBody);
    }





})(app.models);
