require("dotenv").config();
const mongoose = require("mongoose");
const Hub = require("./models/Hub");
const Route = require("./models/Route");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Hub.deleteMany({});
    await Route.deleteMany({});
    console.log("Cleared existing data");

    // Create hubs
    const hubs = await Hub.insertMany([
      { name: "Main Distribution Center", code: "HUB001" },
      { name: "North Warehouse", code: "HUB002" },
      { name: "South Warehouse", code: "HUB003" },
      { name: "East Distribution Hub", code: "HUB004" },
      { name: "West Logistics Center", code: "HUB005" },
    ]);
    console.log("Created 5 hubs");

    // Create routes between hubs
    const routes = await Route.insertMany([
      {
        fromHub: hubs[0]._id,
        toHub: hubs[1]._id,
        distance: 50,
        travelTime: 60,
        fuelCost: 100,
        trafficLevel: "LOW",
        isBlocked: false,
      },
      {
        fromHub: hubs[0]._id,
        toHub: hubs[2]._id,
        distance: 75,
        travelTime: 90,
        fuelCost: 150,
        trafficLevel: "MEDIUM",
        isBlocked: false,
      },
      {
        fromHub: hubs[1]._id,
        toHub: hubs[3]._id,
        distance: 40,
        travelTime: 45,
        fuelCost: 80,
        trafficLevel: "LOW",
        isBlocked: false,
      },
      {
        fromHub: hubs[2]._id,
        toHub: hubs[4]._id,
        distance: 60,
        travelTime: 70,
        fuelCost: 120,
        trafficLevel: "HIGH",
        isBlocked: false,
      },
      {
        fromHub: hubs[3]._id,
        toHub: hubs[4]._id,
        distance: 55,
        travelTime: 65,
        fuelCost: 110,
        trafficLevel: "MEDIUM",
        isBlocked: false,
      },
      {
        fromHub: hubs[1]._id,
        toHub: hubs[2]._id,
        distance: 30,
        travelTime: 35,
        fuelCost: 60,
        trafficLevel: "LOW",
        isBlocked: false,
      },
    ]);
    console.log("Created 6 routes");

    console.log("\n=== Seed Data Created Successfully ===");
    console.log("\nHubs:");
    hubs.forEach((hub) => {
      console.log(`  ${hub.code}: ${hub.name} (ID: ${hub._id})`);
    });

    console.log("\nRoutes:");
    routes.forEach((route) => {
      const fromHub = hubs.find((h) => h._id.toString() === route.fromHub.toString());
      const toHub = hubs.find((h) => h._id.toString() === route.toHub.toString());
      console.log(`  ${fromHub.code} -> ${toHub.code}: ${route.distance}km, ${route.travelTime}min`);
    });

    console.log("\n=== Example API Usage ===");
    console.log(`Optimize route from ${hubs[0].code} to ${hubs[4].code}:`);
    console.log(`POST /api/routes/optimize`);
    console.log(`Body: { "start": "${hubs[0]._id}", "end": "${hubs[4]._id}" }`);

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

seed();
