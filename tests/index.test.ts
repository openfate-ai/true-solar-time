import { calculateTrueSolarTime } from '../src/index';

interface TestCase {
    name: string;
    input: {
        solarYear: number;
        solarMonth: number;
        solarDay: number;
        actualHour: number;
        actualMinute: number;
        longitude: number;
        timezone: number;
        dstOffset: number;
        hasTime: boolean;
        enableTrueSolarTime: boolean;
        year: number;
        month: number;
        day: number;
    };
    expected: {
        trueSolarTime?: string;
        solarDate?: string;
        useTolerance?: boolean;
    };
    category: 'Geo' | 'EoT' | 'History';
}

const testCases: TestCase[] = [
    // === I. Geographical & Timezone Extremes ===
    {
        category: 'Geo',
        name: "[Geo] China Extreme West (Kashgar) 76°E, UTC+8 (Double Negative limit)",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 76, timezone: 8, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '09:00', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] China Extreme East (Fuyuan) 134°E, UTC+8",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 134, timezone: 8, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '12:52', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] Half-hour timezone (New Delhi, India) 77.2°E, UTC+5.5",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 77.2, timezone: 5.5, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '11:35', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] 15-minute timezone (Kathmandu, Nepal) 85.3°E, UTC+5.75",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 85.3, timezone: 5.75, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '11:52', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] Prime Meridian (London, UK) 0°, UTC+0",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 0, timezone: 0, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '11:56', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] West Hemisphere Negative Longitude (NYC, USA) -74°W, UTC-5",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: -74, timezone: -5, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '12:00', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] International Date Line (Fiji - Far West Longitude) 178°E, UTC+12",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 178, timezone: 12, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '11:48', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] International Date Line (Howland Island - Far East Longitude) -176°W, UTC-12",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: -176, timezone: -12, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '12:11', solarDate: '2024-01-01' }
    },
    {
        category: 'Geo',
        name: "[Geo] Date line rollover (Mid West) Fiji 178°E Cross-Year",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 0, actualMinute: 5, longitude: 178, timezone: 12, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '23:53', solarDate: '2023-12-31' }
    },
    {
        category: 'Geo',
        name: "[Geo] Date line rollover (Mid East) Baker Island -176°W Next-Day",
        input: { solarYear: 2024, solarMonth: 1, solarDay: 1, actualHour: 23, actualMinute: 55, longitude: -176, timezone: -12, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 1, day: 1 },
        expected: { trueSolarTime: '00:06', solarDate: '2024-01-02' }
    },

    // === II. Astronomical Equation of Time Extremes ===
    {
        category: 'EoT',
        name: "[EoT] Maximum Positive Value (Nov 3)",
        input: { solarYear: 2024, solarMonth: 11, solarDay: 3, actualHour: 12, actualMinute: 0, longitude: 120, timezone: 8, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 11, day: 3 },
        expected: { trueSolarTime: '12:16', useTolerance: true }
    },
    {
        category: 'EoT',
        name: "[EoT] Maximum Negative Value (Feb 11)",
        input: { solarYear: 2024, solarMonth: 2, solarDay: 11, actualHour: 12, actualMinute: 0, longitude: 120, timezone: 8, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 2, day: 11 },
        expected: { trueSolarTime: '11:45', useTolerance: true }
    },
    {
        category: 'EoT',
        name: "[EoT] Zero Crossing point (April 15)",
        input: { solarYear: 2024, solarMonth: 4, solarDay: 15, actualHour: 12, actualMinute: 0, longitude: 120, timezone: 8, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 4, day: 15 },
        expected: { trueSolarTime: '12:00', useTolerance: true }
    },
    {
        category: 'EoT',
        name: "[EoT] Leap Year February Boundary (Feb 29, 2024)",
        input: { solarYear: 2024, solarMonth: 2, solarDay: 29, actualHour: 12, actualMinute: 0, longitude: 120, timezone: 8, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2024, month: 2, day: 29 },
        expected: { trueSolarTime: '11:46', useTolerance: true }
    },
    {
        category: 'EoT',
        name: "[EoT] Century Epoch (Jan 1, 2000 12:00 UTC)",
        input: { solarYear: 2000, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 0, timezone: 0, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 2000, month: 1, day: 1 },
        expected: { trueSolarTime: '11:56', useTolerance: true }
    },

    // === III. Historical DST & Timezone Anomalies ===
    {
        category: 'History',
        name: "[History] China DST transition (1986-05-04 12:00) with DST offset",
        input: { solarYear: 1986, solarMonth: 5, solarDay: 4, actualHour: 12, actualMinute: 0, longitude: 116.4, timezone: 8, dstOffset: 1, hasTime: true, enableTrueSolarTime: true, year: 1986, month: 5, day: 4 },
        expected: { trueSolarTime: '10:48', solarDate: '1986-05-04' }
    },
    {
        category: 'History',
        name: "[History] Singapore historical timezone shift (1970 used UTC+7:30)",
        input: { solarYear: 1970, solarMonth: 1, solarDay: 1, actualHour: 12, actualMinute: 0, longitude: 103.8, timezone: 7.5, dstOffset: 0, hasTime: true, enableTrueSolarTime: true, year: 1970, month: 1, day: 1 },
        expected: { trueSolarTime: '11:21', solarDate: '1970-01-01' }
    },
    {
        category: 'History',
        name: "[History] NYC overlap hour — interpret as DST-active local clock",
        input: { solarYear: 2023, solarMonth: 11, solarDay: 5, actualHour: 1, actualMinute: 30, longitude: -74, timezone: -5, dstOffset: 1, hasTime: true, enableTrueSolarTime: true, year: 2023, month: 11, day: 5 },
        expected: { trueSolarTime: '00:50', solarDate: '2023-11-05' }
    },
];

function timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function isTimeWithinTolerance(got: string, exp: string, toleranceMinutes: number = 1): boolean {
    const gotMins = timeToMinutes(got);
    const expMins = timeToMinutes(exp);
    let diff = Math.abs(gotMins - expMins);
    if (diff > 720) diff = 1440 - diff; 
    return diff <= toleranceMinutes;
}

function runAll() {
    console.log(`🚀 Starting ${testCases.length} True Solar Time Regression tests...\n`);

    let totalPassed = 0;

    testCases.forEach((test) => {
        try {
            // Unpack old inputs to V2 signature
            const inputParams = {
                year: test.input.solarYear,
                month: test.input.solarMonth,
                day: test.input.solarDay,
                hour: test.input.actualHour,
                minute: test.input.actualMinute,
                timeZoneOffset: test.input.timezone,
                dstOffset: test.input.dstOffset
            };

            const options = {
                longitude: test.input.longitude,
                algorithm: 'approx' as const // Keep approx mathematically identical to v1 test data
            };

            const result = calculateTrueSolarTime(inputParams, options);

            const gotTime = result.trueSolarTime.substring(0, 5); // get HH:mm 
            const gotDate = result.trueSolarDateTime.split(' ')[0]; // get YYYY-MM-DD

            const assertions: { label: string; pass: boolean; got: string; exp: string }[] = [];

            if (test.expected.trueSolarTime) {
                const pass = test.expected.useTolerance 
                    ? isTimeWithinTolerance(gotTime, test.expected.trueSolarTime)
                    : gotTime === test.expected.trueSolarTime;
                assertions.push({ label: 'Time', pass, got: gotTime, exp: test.expected.trueSolarTime });
            }

            if (test.expected.solarDate) {
                const pass = gotDate === test.expected.solarDate;
                assertions.push({ label: 'Date', pass, got: gotDate, exp: test.expected.solarDate });
            }

            const allPassed = assertions.every(a => a.pass);
            if (allPassed) {
                console.log(`✅ [${test.category}] ${test.name}`);
                totalPassed++;
            } else {
                console.log(`❌ [${test.category}] ${test.name}`);
                assertions.forEach(a => {
                    if (!a.pass) {
                        console.log(`   FAIL ${a.label} -> Got: [${a.got}], Exp: [${a.exp}]`);
                    }
                });
            }

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.log(`❌ [${test.category}] ${test.name}`);
            console.log(`   ERROR: ${errorMessage}`);
        }
    });

    console.log(`\n=================================================`);
    console.log(`  FINAL SUMMARY: ✅ ${totalPassed}/${testCases.length} Cases Passed`);
    console.log(`=================================================\n`);
    
    if (totalPassed !== testCases.length) {
        process.exit(1);
    }
}

runAll();
