import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.priceHistory.deleteMany();
  await prisma.comparable.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.marketData.deleteMany();
  console.log("Cleared existing data.");

  // Create auctions
  const auctions = await Promise.all([
    prisma.auction.create({
      data: {
        externalId: "bat-porsche-911-rs-1973",
        platform: "BRING_A_TRAILER",
        url: "https://bringatrailer.com/listing/1973-porsche-911-rs",
        title: "1973 Porsche 911 Carrera RS 2.7",
        make: "Porsche",
        model: "911",
        year: 1973,
        trim: "Carrera RS 2.7",
        mileage: 48200,
        transmission: "5-Speed Manual",
        engine: "2.7L Flat-6",
        exteriorColor: "Grand Prix White",
        interiorColor: "Black Leather",
        location: "Monterey, CA",
        currentBid: 1250000,
        reserveStatus: "NO_RESERVE",
        bidCount: 87,
        viewCount: 34500,
        watchCount: 1200,
        startTime: new Date("2026-01-20T10:00:00Z"),
        endTime: new Date("2026-01-27T22:00:00Z"),
        status: "SOLD",
        finalPrice: 1350000,
        description:
          "Matching-numbers 1973 Porsche 911 Carrera RS 2.7 Lightweight in Grand Prix White. One of 200 Sport (Lightweight) examples produced.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/9/9c/Porsche_911_Carrera_RS%2C_Bj._1972-73%2C_Front_%282016-07-02_02_Sp%29.JPG",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "bat-bmw-m3-e30-1988",
        platform: "BRING_A_TRAILER",
        url: "https://bringatrailer.com/listing/1988-bmw-m3-e30",
        title: "1988 BMW M3 E30",
        make: "BMW",
        model: "M3",
        year: 1988,
        trim: "E30",
        mileage: 72400,
        transmission: "5-Speed Manual (Getrag 265)",
        engine: "2.3L S14 I4",
        exteriorColor: "Alpine White",
        interiorColor: "Cardinal Red Leather",
        location: "Greenwich, CT",
        currentBid: 92000,
        reserveStatus: "NO_RESERVE",
        bidCount: 64,
        viewCount: 18700,
        watchCount: 890,
        startTime: new Date("2026-01-22T10:00:00Z"),
        endTime: new Date("2026-01-29T22:00:00Z"),
        status: "SOLD",
        finalPrice: 102000,
        description:
          "Unmodified 1988 BMW E30 M3 in Alpine White over Cardinal Red leather. All original with documented service history.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/d/d8/BMW_E30_M3_1.JPG",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "bat-toyota-supra-1994",
        platform: "BRING_A_TRAILER",
        url: "https://bringatrailer.com/listing/1994-toyota-supra-turbo",
        title: "1994 Toyota Supra Turbo 6-Speed",
        make: "Toyota",
        model: "Supra",
        year: 1994,
        trim: "Turbo",
        mileage: 38900,
        transmission: "6-Speed Manual (V160)",
        engine: "3.0L 2JZ-GTE Twin-Turbo I6",
        exteriorColor: "Super White",
        interiorColor: "Black Leather",
        location: "Scottsdale, AZ",
        currentBid: 145000,
        reserveStatus: "RESERVE_MET",
        bidCount: 51,
        viewCount: 28900,
        watchCount: 1540,
        startTime: new Date("2026-01-25T10:00:00Z"),
        endTime: new Date("2026-02-01T22:00:00Z"),
        status: "SOLD",
        finalPrice: 168000,
        description:
          "Unmodified 1994 Toyota Supra Turbo with the desirable 6-speed manual transmission. All stock with factory twin-turbo setup.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/7/70/Toyota_Supra_RZ_%28JZA80%29_front.JPG",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "bat-ferrari-275-gtb4-1967",
        platform: "BRING_A_TRAILER",
        url: "https://bringatrailer.com/listing/1967-ferrari-275-gtb4",
        title: "1967 Ferrari 275 GTB/4",
        make: "Ferrari",
        model: "275 GTB",
        year: 1967,
        trim: "GTB/4",
        mileage: 31200,
        transmission: "5-Speed Manual (Transaxle)",
        engine: "3.3L Colombo V12",
        exteriorColor: "Rosso Corsa",
        interiorColor: "Nero Leather",
        location: "Palm Beach, FL",
        currentBid: 2800000,
        reserveStatus: "RESERVE_MET",
        bidCount: 34,
        viewCount: 52000,
        watchCount: 2100,
        startTime: new Date("2026-01-15T10:00:00Z"),
        endTime: new Date("2026-01-22T22:00:00Z"),
        status: "SOLD",
        finalPrice: 3200000,
        description:
          "Matching-numbers 1967 Ferrari 275 GTB/4 in Rosso Corsa with Classiche certification. One of 330 examples produced.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/0/09/SC06_Ferrari_275_GTB.jpg",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "cab-mercedes-300sl-1955",
        platform: "CARS_AND_BIDS",
        url: "https://carsandbids.com/auctions/1955-mercedes-300sl-gullwing",
        title: "1955 Mercedes-Benz 300SL Gullwing",
        make: "Mercedes-Benz",
        model: "300SL",
        year: 1955,
        trim: "Gullwing Coupe",
        mileage: 42100,
        transmission: "4-Speed Manual",
        engine: "3.0L M198 I6",
        exteriorColor: "Silver",
        interiorColor: "Red Leather",
        location: "Beverly Hills, CA",
        currentBid: 1450000,
        reserveStatus: "RESERVE_NOT_MET",
        bidCount: 28,
        viewCount: 45000,
        watchCount: 1800,
        startTime: new Date("2026-01-28T10:00:00Z"),
        endTime: new Date("2026-02-04T22:00:00Z"),
        status: "ENDED",
        finalPrice: null,
        description:
          "Spectacular 1955 Mercedes-Benz 300SL Gullwing in original Silver with Red leather interior.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/8/8b/1956_Mercedes-Benz_300SL.jpg",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "cab-ford-gt40-1966",
        platform: "CARS_AND_BIDS",
        url: "https://carsandbids.com/auctions/1966-ford-gt40",
        title: "1966 Ford GT40 Mk I",
        make: "Ford",
        model: "GT40",
        year: 1966,
        trim: "Mk I",
        mileage: 8200,
        transmission: "5-Speed Manual (ZF Transaxle)",
        engine: "4.7L Ford V8",
        exteriorColor: "Gulf Blue / Orange",
        interiorColor: "Black",
        location: "Goodwood, UK",
        currentBid: 4500000,
        reserveStatus: "RESERVE_MET",
        bidCount: 19,
        viewCount: 68000,
        watchCount: 3200,
        startTime: new Date("2026-01-10T10:00:00Z"),
        endTime: new Date("2026-01-17T22:00:00Z"),
        status: "SOLD",
        finalPrice: 5100000,
        description:
          "Genuine 1966 Ford GT40 Mk I in iconic Gulf livery. Le Mans history, fully documented provenance.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/3/34/1966_Ford_GT40.jpg",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "cc-jaguar-etype-1963",
        platform: "COLLECTING_CARS",
        url: "https://collectingcars.com/sale/1963-jaguar-e-type",
        title: "1963 Jaguar E-Type Series 1 FHC",
        make: "Jaguar",
        model: "E-Type",
        year: 1963,
        trim: "Series 1 FHC 3.8",
        mileage: 54300,
        transmission: "4-Speed Manual (Moss)",
        engine: "3.8L XK I6",
        exteriorColor: "British Racing Green",
        interiorColor: "Biscuit Leather",
        location: "London, UK",
        currentBid: 185000,
        reserveStatus: "NO_RESERVE",
        bidCount: 42,
        viewCount: 21000,
        watchCount: 950,
        startTime: new Date("2026-01-18T10:00:00Z"),
        endTime: new Date("2026-01-25T22:00:00Z"),
        status: "SOLD",
        finalPrice: 210000,
        description:
          "Beautifully restored 1963 Jaguar E-Type Series 1 Fixed Head Coupe in BRG. Heritage certificate included.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/5/53/1961_Jaguar_E-Type.jpg",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "bat-nissan-skyline-gtr-1999",
        platform: "BRING_A_TRAILER",
        url: "https://bringatrailer.com/listing/1999-nissan-skyline-gtr-r34",
        title: "1999 Nissan Skyline GT-R V-Spec (R34)",
        make: "Nissan",
        model: "Skyline GT-R",
        year: 1999,
        trim: "V-Spec R34",
        mileage: 42100,
        transmission: "6-Speed Manual (Getrag)",
        engine: "2.6L RB26DETT Twin-Turbo I6",
        exteriorColor: "Bayside Blue",
        interiorColor: "Black",
        location: "Los Angeles, CA",
        currentBid: 385000,
        reserveStatus: "NO_RESERVE",
        bidCount: 73,
        viewCount: 41000,
        watchCount: 2300,
        startTime: new Date("2026-01-30T10:00:00Z"),
        endTime: new Date("2026-02-06T22:00:00Z"),
        status: "ACTIVE",
        description:
          "Legally imported 1999 Nissan Skyline GT-R V-Spec in Bayside Blue. Bone stock with full documentation.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/9/90/1999_Nissan_Skyline_GT-R.jpg",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "bat-lamborghini-miura-1971",
        platform: "BRING_A_TRAILER",
        url: "https://bringatrailer.com/listing/1971-lamborghini-miura-sv",
        title: "1971 Lamborghini Miura P400 SV",
        make: "Lamborghini",
        model: "Miura",
        year: 1971,
        trim: "P400 SV",
        mileage: 22400,
        transmission: "5-Speed Manual",
        engine: "3.9L V12",
        exteriorColor: "Verde Metallizzata",
        interiorColor: "Tobacco Leather",
        location: "Amelia Island, FL",
        currentBid: 2100000,
        reserveStatus: "RESERVE_MET",
        bidCount: 31,
        viewCount: 56000,
        watchCount: 2800,
        startTime: new Date("2026-02-01T10:00:00Z"),
        endTime: new Date("2026-02-08T22:00:00Z"),
        status: "ACTIVE",
        description:
          "Stunning 1971 Lamborghini Miura P400 SV in Verde Metallizzata. One of 150 SVs produced. Full Polo Storico documentation.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/7/7f/1971_Lamborghini_Miura_SV_385hp_V12%2C_4L_pD.JPG",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "cc-aston-martin-db5-1964",
        platform: "COLLECTING_CARS",
        url: "https://collectingcars.com/sale/1964-aston-martin-db5",
        title: "1964 Aston Martin DB5",
        make: "Aston Martin",
        model: "DB5",
        year: 1964,
        trim: "Vantage",
        mileage: 65200,
        transmission: "5-Speed Manual (ZF)",
        engine: "4.0L I6",
        exteriorColor: "Silver Birch",
        interiorColor: "Black Connolly Leather",
        location: "London, UK",
        currentBid: 780000,
        reserveStatus: "RESERVE_NOT_MET",
        bidCount: 38,
        viewCount: 32000,
        watchCount: 1600,
        startTime: new Date("2026-02-02T10:00:00Z"),
        endTime: new Date("2026-02-09T22:00:00Z"),
        status: "ENDING_SOON",
        description:
          "1964 Aston Martin DB5 Vantage in Silver Birch. The most iconic GT ever made. Matching numbers with full service history.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/9/94/Aston_Martin_DB5_James_Bond.JPG",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "cab-porsche-959-1988",
        platform: "CARS_AND_BIDS",
        url: "https://carsandbids.com/auctions/1988-porsche-959",
        title: "1988 Porsche 959 Sport",
        make: "Porsche",
        model: "959",
        year: 1988,
        trim: "Sport",
        mileage: 12300,
        transmission: "6-Speed Manual",
        engine: "2.85L Twin-Turbo Flat-6",
        exteriorColor: "Guards Red",
        interiorColor: "Gray Leather",
        location: "Pebble Beach, CA",
        currentBid: 1650000,
        reserveStatus: "NO_RESERVE",
        bidCount: 56,
        viewCount: 48000,
        watchCount: 2400,
        startTime: new Date("2026-02-03T10:00:00Z"),
        endTime: new Date("2026-02-10T22:00:00Z"),
        status: "ACTIVE",
        description:
          "1988 Porsche 959 Sport — the ultimate supercar of its era. One of 292 examples produced, in pristine Guards Red.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/8/85/Porsche_959_%E2%80%93_Frontansicht_%281%29%2C_21._M%C3%A4rz_2013%2C_D%C3%BCsseldorf.jpg",
        ],
      },
    }),
    prisma.auction.create({
      data: {
        externalId: "bat-mclaren-f1-1995",
        platform: "BRING_A_TRAILER",
        url: "https://bringatrailer.com/listing/1995-mclaren-f1",
        title: "1995 McLaren F1",
        make: "McLaren",
        model: "F1",
        year: 1995,
        trim: "Road Car",
        mileage: 9800,
        transmission: "6-Speed Manual",
        engine: "6.1L BMW S70/2 V12",
        exteriorColor: "Papaya Orange",
        interiorColor: "Light Tan Leather",
        location: "Monaco",
        currentBid: 18500000,
        reserveStatus: "RESERVE_MET",
        bidCount: 12,
        viewCount: 120000,
        watchCount: 5600,
        startTime: new Date("2026-02-01T10:00:00Z"),
        endTime: new Date("2026-02-15T22:00:00Z"),
        status: "ACTIVE",
        description:
          "1995 McLaren F1 Road Car in Papaya Orange. One of 64 road cars produced. Complete with Facom tool chest and fitted luggage.",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/5/53/MclarenF1.JPG",
        ],
      },
    }),
  ]);

  console.log(`Created ${auctions.length} auctions.`);

  // Create price history entries for sold auctions
  const soldAuctions = auctions.filter((a) => a.status === "SOLD");
  for (const auction of soldAuctions) {
    const basePrice = (auction.finalPrice || auction.currentBid || 100000) * 0.3;
    const finalPrice = auction.finalPrice || auction.currentBid || 100000;
    const days = 7;
    for (let i = 0; i <= days; i++) {
      const progress = i / days;
      const bid = basePrice + (finalPrice - basePrice) * Math.pow(progress, 1.5);
      await prisma.priceHistory.create({
        data: {
          auctionId: auction.id,
          bid: Math.round(bid),
          timestamp: new Date(
            new Date(auction.startTime!).getTime() +
              i * 24 * 60 * 60 * 1000
          ),
        },
      });
    }
  }
  console.log("Created price history entries.");

  // Create market data
  await Promise.all([
    prisma.marketData.create({
      data: {
        make: "Porsche",
        model: "911",
        yearStart: 1970,
        yearEnd: 1975,
        avgPrice: 850000,
        medianPrice: 720000,
        lowPrice: 350000,
        highPrice: 1450000,
        totalSales: 142,
        trend: "APPRECIATING",
      },
    }),
    prisma.marketData.create({
      data: {
        make: "BMW",
        model: "M3",
        yearStart: 1986,
        yearEnd: 1991,
        avgPrice: 88000,
        medianPrice: 82000,
        lowPrice: 55000,
        highPrice: 145000,
        totalSales: 89,
        trend: "APPRECIATING",
      },
    }),
    prisma.marketData.create({
      data: {
        make: "Toyota",
        model: "Supra",
        yearStart: 1993,
        yearEnd: 1998,
        avgPrice: 125000,
        medianPrice: 115000,
        lowPrice: 65000,
        highPrice: 210000,
        totalSales: 67,
        trend: "APPRECIATING",
      },
    }),
    prisma.marketData.create({
      data: {
        make: "Ferrari",
        model: "275 GTB",
        yearStart: 1964,
        yearEnd: 1968,
        avgPrice: 2800000,
        medianPrice: 2650000,
        lowPrice: 1800000,
        highPrice: 3500000,
        totalSales: 23,
        trend: "STABLE",
      },
    }),
    prisma.marketData.create({
      data: {
        make: "Mercedes-Benz",
        model: "300SL",
        yearStart: 1954,
        yearEnd: 1957,
        avgPrice: 1350000,
        medianPrice: 1200000,
        lowPrice: 800000,
        highPrice: 1800000,
        totalSales: 31,
        trend: "APPRECIATING",
      },
    }),
    prisma.marketData.create({
      data: {
        make: "Nissan",
        model: "Skyline GT-R",
        yearStart: 1999,
        yearEnd: 2002,
        avgPrice: 320000,
        medianPrice: 295000,
        lowPrice: 180000,
        highPrice: 480000,
        totalSales: 45,
        trend: "APPRECIATING",
      },
    }),
  ]);
  console.log("Created market data entries.");

  // Create analyses for some auctions
  await Promise.all([
    prisma.analysis.create({
      data: {
        auctionId: auctions[0].id, // Porsche 911 RS
        bidTargetLow: 1100000,
        bidTargetHigh: 1400000,
        confidence: "HIGH",
        criticalQuestions: [
          "Has the engine been rebuilt? If so, by whom?",
          "Is the original toolkit and spare complete?",
          "What is the provenance chain since new?",
        ],
        redFlags: [],
        keyStrengths: [
          "Matching-numbers Lightweight variant",
          "Documented ownership history",
          "Recent concours restoration by marque specialist",
        ],
        yearlyMaintenance: 8500,
        insuranceEstimate: 15000,
        majorServiceCost: 25000,
        investmentGrade: "EXCELLENT",
        appreciationPotential: "8-12% annually based on 10-year trend",
      },
    }),
    prisma.analysis.create({
      data: {
        auctionId: auctions[1].id, // BMW M3 E30
        bidTargetLow: 85000,
        bidTargetHigh: 110000,
        confidence: "HIGH",
        criticalQuestions: [
          "Has the head gasket been replaced?",
          "Any accident history or bodywork?",
          "Original paint or repaint?",
        ],
        redFlags: ["High mileage for a collectible E30 M3"],
        keyStrengths: [
          "Completely unmodified example",
          "Full service history from BMW dealers",
          "Desirable color combination",
        ],
        yearlyMaintenance: 3500,
        insuranceEstimate: 2800,
        majorServiceCost: 8000,
        investmentGrade: "GOOD",
        appreciationPotential: "5-8% annually",
      },
    }),
    prisma.analysis.create({
      data: {
        auctionId: auctions[7].id, // Nissan Skyline GT-R R34
        bidTargetLow: 350000,
        bidTargetHigh: 420000,
        confidence: "MEDIUM",
        criticalQuestions: [
          "Is the import fully legal with EPA/DOT exemption?",
          "Has the engine been modified or tuned?",
          "Original or replacement turbos?",
        ],
        redFlags: [
          "R34 imports can have legal grey areas",
          "Market may be at a plateau",
        ],
        keyStrengths: [
          "V-Spec trim — most desirable variant",
          "Iconic Bayside Blue color",
          "Bone stock unmodified example",
        ],
        yearlyMaintenance: 4200,
        insuranceEstimate: 6500,
        majorServiceCost: 12000,
        investmentGrade: "GOOD",
        appreciationPotential: "3-6% annually, market maturing",
      },
    }),
  ]);
  console.log("Created analysis entries.");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
