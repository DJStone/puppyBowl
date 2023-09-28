const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const cohortName = '2302-ACC-CT-WEB-PT-B';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

function togglePlayerListVisibility(displayVal,) {
    const playerElements = document.getElementsByClassName('player');
    for (const playerElement of playerElements) {
        playerElement.style.display = displayVal;
    }

    newPlayerFormContainer.style.display = displayVal;
}

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players/`);
        const players = await response.json(); 
        return players.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}players/${playerId}/`);
        const player = await response.json();
        return player.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}players/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playerObj)
            });
        const newPlayer = await response.json();
        console.log(typeof (newPlayer))
        return newPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const updatePlayer = async (playerObj) => {
    try {
        const playerId = await playerObj.id;
        const response = await fetch(`${APIURL}players/${playerId}/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playerObj)
            });
        const updatedPlayer = await response.json();
        console.log(updatedPlayer);
        return updatedPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with updating that player!', err);
    }
}

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}players/${playerId}/`,
            {
                method: 'DELETE'
            });
        const player = await response.json();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const fetchAllTeams = async () => {
    try {
        const response = await fetch(`${APIURL}teams/`);
        const teams = await response.json();
        return teams;
    } catch (err) {
        console.error(`'Oh no, trouble fetching teams!`, err);
    }
}

const renderSinglePlayerById = async (id) => {
    try {
        const player = await fetchSinglePlayer(id);
        const playerDetailsElememt = document.createElement('div');
        playerDetailsElememt.classList.add('player-details');
        playerDetailsElememt.innerHTML = `
            <h1>${player.name}</h1>
            <p><img src = ${player.imageUrl}></p>
            <p><strong>ID:</strong> ${player.id}</p>
            <p><strong>BREED:</strong> ${player.breed}</p>
            <p><strong>STATUS:</strong> ${player.status}</p>
            <p><strong>Created at:</strong> ${player.createdAt}</p>
            <p><strong>Updated at:</strong> ${player.updatedAt}</p>
            <p><strong>Team ID:</strong> ${player.teamId}</p>
            <p><strong>Cohort ID:</strong> ${player.cohortId}</p>
            <button class="close-button">Close</button>
        `;

        playerContainer.appendChild(playerDetailsElememt);

        const closeButton = playerDetailsElememt.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            playerDetailsElememt.remove();
            togglePlayerListVisibility('flex');
        });
    } catch (err) {
        console.error(`Uh oh, trouble rendering player #${playerId}!`, err);
    }
}

const renderAllPlayers = async (playerList) => {
    try {
        playerContainer.innerHTML = '';
        playerList.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
            <h1>${player.name}</h1>
            <p><img src = ${player.imageUrl}></p>
            <p><strong>ID:</strong> ${player.id}</p>
            <p><strong>Breed:</strong> ${player.breed}</p>
            <p><strong>Status:</strong> ${player.status}</p>
            <p><strong>Created at:</strong> ${player.createdAt}</p>
            <p><strong>Updated at:</strong> ${player.updatedAt}</p>
            <p><strong>Team ID:</strong> ${player.teamId}</p>
            <p><strong>Cohort ID:</strong> ${player.cohortId}</p>
            <button class="details-button" data-id="${player.id}">See Details</button>
            <button class="edit-button" data-id="${player.id}">Edit Player</button>
            <button class="delete-button" data-id="${player.id}">Remove from Roster</button>
            `;

            playerContainer.appendChild(playerElement);

            const detailsButton = playerElement.querySelector('.details-button');
            detailsButton.addEventListener('click', async (event) => {
                togglePlayerListVisibility('none');
                renderSinglePlayerById(event.target.dataset.id);
            });

            const editButton = playerElement.querySelector('.edit-button');
            editButton.addEventListener('click', async (event) => {
                togglePlayerListVisibility('none');
                renderUpdatedPlayerForm(event.target.dataset.id);
            })

            const deleteButton = playerElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', async (event) => {
                await removePlayer(event.target.dataset.id);
                await window.location.reload();
            });
        });
        return playerContainer;
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


const renderNewPlayerForm = async () => {
    try {
        let form = `
        <form>
            <label>Name: </label><input type="text" name="name" placeholder="required" required><br><br>
            <label>Breed: </label><input type="text" name="breed" placeholder="required" required><br><br>
            <label>Status: </label><select name="status">
                <option value="Benched">benched</option>
                <option value="Active">active</option>
            </select><br><br>
            <label>ImageUrl: </label><input type="url" name="imageUrl" placeholder="optional"><br><br>
            <label>TeamId: </label><input type="number" name="teamId" placeholder="optional"><br><br>
            <input type="submit" value="Add new Player">
        </form>
        `
        newPlayerFormContainer.innerHTML = form;
        newPlayerFormContainer.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementsByName('name')[0].value;
            const breed = document.getElementsByName('breed')[0].value;
            const status = document.getElementsByName('status')[0].value;
            const imageUrl = document.getElementsByName('imageUrl')[0].value;
            const teamId = document.getElementsByName('teamId')[0].value;
            const newPlayer = {
                name,
                breed,
                status,
                imageUrl,
                teamId,
            }

            if (imageUrl === '')
                delete newPlayer.imageUrl;
            if (teamId === '')
                delete newPlayer.teamId;

            debugger;
            await addNewPlayer(newPlayer);
            console.log(newPlayer);
            await window.location.reload();
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const renderUpdatedPlayerForm = async (id) => {
    try {
        const player = await fetchSinglePlayer(id);
        const playerEditElement = document.createElement('div');
        playerEditElement.classList.add('player-edit');
        playerEditElement.innerHTML = `
        <form>
            <label>Name: </label><input type="text" name="name" value="${player.name}" required><br><br>
            <label>Breed: </label><input type="text" name="breed" value="${player.breed}" required><br><br>
            <label>Status: </label><select name="status">
                <option selected="${player.status}">${player.status}</option>
                <option value="Benched">benched</option>
                <option value="Active">active</option>
            </select><br><br>
            <label>ImageUrl: </label><input type="url" name="imageUrl" value="${player.imageUrl}"><br><br>
            <label>TeamId: </label><input type="number" name="teamId" value="${player.teamId}"><br><br>
            <input type="submit" value="Save">
        </form>
        <button class="cancel-button">Cancel</button>
        `;

        playerContainer.appendChild(playerEditElement);
        playerEditElement.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementsByName('name')[0].value;
            const id = document.getElementsByName('id')[0].value;
            const breed = document.getElementsByName('breed')[0].value;
            const status = document.getElementsByName('status')[0].value;
            const imageUrl = document.getElementsByName('imageUrl')[0].value;
            const createdAt = document.getElementsByName('name')[0].value;
            const updatedAt = new Date().getTime();
            const teamId = document.getElementsByName('teamId')[0].value;
            const cohortId = document.getElementsByName('cohortId')[0].value;
            const updatedPlayer = {
                name,
                breed,
                status,
                imageUrl,
                teamId,
            }

            if (imageUrl === '')
                delete upadtedPlayer.imageUrl;
            if (teamId === '')
                delete updatedPlayer.teamId;
            await updatePlayer(updatedPlayer);
            await window.location.reload();
        });

        const cancelButton = playerEditElement.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            playerEditElement.remove();
            togglePlayerListVisibility('flex');
        });
    } catch (err) {
        console.error(`Uh oh, trouble editing player #${playerId}!`, err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
}

init();

module.exports = {
    cohortName,
    APIURL
};