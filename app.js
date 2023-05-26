const readline = require('readline');

const locations = [
    {
        name: "Cooler",
        description: "You are at cooler region.",
        items: ["Apple"],
        exits: {
            east: "Cave",
            west: "Forest",
        },
    },
    {
        name: "River",
        description: "You are by a calm river.",
        items: ["Coconuts"],
        exits: {
            west: "Forest",
            east: "Cave",
        },
    },
    {
        name: "Forest",
        description: "You are in a dense forest.",
        items: ["Banana"],
        exits: {
            north: "River",
            south: "Cooler",
        },
    },
    {
        name: "Cave",
        description: "You are surrounded by caves and trees.",
        items: ["mango"],
        exits: {
            north: "River",
            south: "Cooler",
        },
    },
];

let currentLocation = locations[0]; // Start at the first location
const inventory = new Set();

const combineInventory = new Set();
let combineAttempts = 0;

// Create an interface for reading user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Welcome to the game! You have to combine two item names within 3 attempts to win the game.Every location has item you have to add inventory using 'add mango'  and check by 'inventory' go all location and enjoy the game");
console.log("Help . \n Direction {east,west,north & south} => location east \n Add a item to Inventory => add apple \n Remove from Inventory => remove apple \n show all Inventory =>inventory \n combine Inventory name => combine gava orange ");
console.log("Enter 'New' to start the game.");

// Function to handle user input
function handleUserInput() {
    rl.question("Enter a command: ", (userInput) => {

        const ar = userInput.split(" ");
        if (ar.length === 0)
            return;

        const command = ar[0].trim().toLowerCase();

        switch (command) {
            case "new":
                // console.log("Game starting...");
                // setTimeout(() => {
                //     startGame();
                // }, 1000);
                // Display the current location's description and items
                console.log(currentLocation.description);

                console.log("Items:", currentLocation.items.join(", "));
                console.log("Diection & Locations:");
                Object.entries(currentLocation.exits).forEach(([direction, location]) => {
                    console.log(`${direction}: ${location}`);
                });
                break;
            case "location":
                const local = ar[1];
                // Check if the current location has an exit in the specified direction
                if (currentLocation.exits.hasOwnProperty(local)) {
                    const newLocation = currentLocation.exits[local];
                    currentLocation = locations.find((location) => location.name.toLowerCase() === newLocation.toLowerCase());

                    console.log("You moved to", currentLocation.name);
                    console.log(currentLocation.description);
                    console.log("Items:", currentLocation.items.join(", "));
                    console.log("Diection & Locations:");
                    Object.entries(currentLocation.exits).forEach(([direction, location]) => {
                        console.log(`${direction}: ${location}`);
                    });
                } else {
                    console.log("You can't go that way.");
                }
                break;
            case "add":
                const itemToAdd = ar[1]; // Extract the item name from the user input

                if (itemToAdd) {
                    const itemIndex = currentLocation.items.findIndex(item => item.toLowerCase() == itemToAdd.toLowerCase());
                    if (itemIndex !== -1) {
                        // const item = currentLocation.items.splice(itemIndex, 1)[0]; // Remove the item from the current location
                        // inventory.push(itemToAdd);
                        inventory.add(itemToAdd.toLowerCase());
                        console.log(`You added ${itemToAdd} to your inventory.`);

                        if (inventory.size === 4) {
                            console.log("You have collected all items. Now you can combine them like command 'combine gava orange' and see results, you only gets 3 combineAttempts.");
                            console.log("Use below inventory to combine:");
                            inventory.forEach(item => console.log(item));
                        }

                    } else {
                        console.log(`The ${itemToAdd} is not available in this location.`);
                    }
                } else {
                    console.log("Invalid item.");
                }
                break;
            case "remove":
                const itemToRemove = ar[1]; // Extract the item name from the user input

                if (itemToRemove) {
                    const itemIndex = inventory.findIndex(item => item.toLowerCase() == itemToRemove.toLowerCase());
                    if (itemIndex !== -1) {
                        inventory.delete(itemToRemove);
                        // const item = inventory.splice(itemIndex, 1)[0]; // Remove the item from the inventory
                        console.log(`You removed ${item} from your inventory.`);
                    } else {
                        console.log(`The ${itemToRemove} is not in your inventory.`);
                    }
                } else {
                    console.log("Invalid item.");
                }
                break;
            case "inventory":
                if (inventory.length === 0) {
                    console.log("Your inventory is empty.");
                } else {
                    console.log("Inventory:");
                    inventory.forEach(item => console.log(item));
                }
                break;
            case "combine":
                const item1 = ar[1].toLowerCase();;
                const item2 = ar[2].toLowerCase();;

                if (item1 && item2) {
                    const combinationResult = combineItems(item1, item2);
                    if (combinationResult) {
                        combineInventory.add(combinationResult);
                        inventory.delete(item1);
                        inventory.delete(item2);
                        console.log(`You combined ${item1} and ${item2} to create ${combinationResult}.`);
                        if (combineInventory.size === 2) {
                            console.log("Congratulations! You have found both correct combinations in the combineInventory.");
                            console.log("You win!");
                            return;
                        }
                    } else {
                        console.log("Invalid combination or items not found in your inventory.");
                    }

                    combineAttempts++;
                    if (combineAttempts >= 5) {
                        console.log("You have reached the maximum number of combine attempts.");
                        console.log("You lose!");
                        return;
                    }
                } else {
                    console.log("Invalid combination command. Please provide two items to combine.");
                }
                break;

            case "restart":
            case "exit":
                inventory.clear();
                combineInventory.clear();
                combineAttempts = 0;
                console.log("Game restarted! All data has been cleared.");
                // rl.close();
                break;
            default:
                console.log("Invalid command.");
        }

        handleUserInput(); // Prompt for the next user input
    });
}

// Start the game
handleUserInput();

function startGame() {
    console.log("Game started!");
    // Rest of the game logic goes here
}

function combineItems(item1, item2) {
    const itemCombination1 = item1.toLowerCase() + "+" + item2.toLowerCase();
    const itemCombination2 = item2.toLowerCase() + "+" + item1.toLowerCase();

    switch (itemCombination1) {
        case "apple+coconuts":
        case "coconut+apple":
            return "pink";
        case "mango+banana":
        case "banana+mango":
            return "amber";
        default:
            return null;
    }
}