/*
 * @licstart  The following is the entire license notice for the JavaScript
 * code in this page.
 *
 * This file is part of gish-ap-calc.
 *
 * gish-ap-calc is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * gish-ap-calc is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with gish-ap-calc.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice for the JavaScript code in
 * this page.
 */

import { allocateAp } from "./lib.js";
import {
    mDps,
    meleePeriod,
    mHitRate,
    psm,
    spellPeriod,
    wacc,
    wDps,
    wHitRate,
} from "./mechanics.js";
import {
    Monster,
    Speed,
    Spell,
    SpellType,
    Stats,
    Weapon,
    WeaponType,
} from "./types.js";

document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        main();
    }
});

function main(): void {
    /**************** INPUTS ****************/

    // Base stats
    const strBaseInput = document.getElementById(
        "str-base",
    ) as HTMLInputElement;
    const dexBaseInput = document.getElementById(
        "dex-base",
    ) as HTMLInputElement;
    const intBaseInput = document.getElementById(
        "int-base",
    ) as HTMLInputElement;
    const lukBaseInput = document.getElementById(
        "luk-base",
    ) as HTMLInputElement;

    // Additional stats
    const strAdditionalInput = document.getElementById(
        "str-additional",
    ) as HTMLInputElement;
    const dexAdditionalInput = document.getElementById(
        "dex-additional",
    ) as HTMLInputElement;
    const intAdditionalInput = document.getElementById(
        "int-additional",
    ) as HTMLInputElement;
    const lukAdditionalInput = document.getElementById(
        "luk-additional",
    ) as HTMLInputElement;
    const waccAdditionalInput = document.getElementById(
        "wacc-additional",
    ) as HTMLInputElement;
    const matkAdditionalInput = document.getElementById(
        "matk-additional",
    ) as HTMLInputElement;

    // Total WATK
    const totalWatkInput = document.getElementById(
        "total-watk",
    ) as HTMLInputElement;

    // AP available
    const apAvailableInput = document.getElementById(
        "ap-available",
    ) as HTMLInputElement;

    // Character
    const levelInput = document.getElementById("level") as HTMLInputElement;

    // Weapon/spell
    const weaponTypeInput = document.getElementById(
        "weapon-type",
    ) as HTMLSelectElement;
    const speedInput = document.getElementById("speed") as HTMLSelectElement;
    const spellInput = document.getElementById("spell") as HTMLSelectElement;
    const spellBasicAtkInput = document.getElementById(
        "spell-basic-atk",
    ) as HTMLInputElement;
    const spellLinesInput = document.getElementById(
        "spell-lines",
    ) as HTMLSelectElement;
    const masteryInput = document.getElementById(
        "mastery",
    ) as HTMLInputElement;
    const spellBoosterInput = document.getElementById(
        "spell-booster",
    ) as HTMLInputElement;

    // Elemental stuff
    const eleAmpInput = document.getElementById("ele-amp") as HTMLInputElement;
    const eleWepInput = document.getElementById("ele-wep") as HTMLInputElement;

    // Enemy
    const wdefInput = document.getElementById(
        "enemy-wdef",
    ) as HTMLInputElement;
    const mdefInput = document.getElementById(
        "enemy-mdef",
    ) as HTMLInputElement;
    const avoidInput = document.getElementById(
        "enemy-avoid",
    ) as HTMLInputElement;
    const eleSusInput = document.getElementById(
        "ele-sus",
    ) as HTMLSelectElement;
    const enemyLevelInput = document.getElementById(
        "enemy-level",
    ) as HTMLInputElement;
    const enemyCountInput = document.getElementById(
        "enemy-count",
    ) as HTMLInputElement;

    // wDominanceFactor
    const wDominanceFactorInput = document.getElementById(
        "w-dominance-factor",
    ) as HTMLInputElement;

    /**************** OUTPUTS ****************/

    // Stats
    const strOutput = document.getElementById("str-output") as HTMLSpanElement;
    const strBaseOutput = document.getElementById(
        "str-base-output",
    ) as HTMLSpanElement;
    const strAdditionalOutput = document.getElementById(
        "str-additional-output",
    ) as HTMLSpanElement;
    const dexOutput = document.getElementById("dex-output") as HTMLSpanElement;
    const dexBaseOutput = document.getElementById(
        "dex-base-output",
    ) as HTMLSpanElement;
    const dexAdditionalOutput = document.getElementById(
        "dex-additional-output",
    ) as HTMLSpanElement;
    const intOutput = document.getElementById("int-output") as HTMLSpanElement;
    const intBaseOutput = document.getElementById(
        "int-base-output",
    ) as HTMLSpanElement;
    const intAdditionalOutput = document.getElementById(
        "int-additional-output",
    ) as HTMLSpanElement;
    const lukOutput = document.getElementById("luk-output") as HTMLSpanElement;
    const lukBaseOutput = document.getElementById(
        "luk-base-output",
    ) as HTMLSpanElement;
    const lukAdditionalOutput = document.getElementById(
        "luk-additional-output",
    ) as HTMLSpanElement;

    // Combat
    const meleeDpsOutput = document.getElementById(
        "melee-dps",
    ) as HTMLSpanElement;
    const spellDpsOutput = document.getElementById(
        "spell-dps",
    ) as HTMLSpanElement;
    const meleeHitRateOutput = document.getElementById(
        "melee-hit-rate",
    ) as HTMLSpanElement;
    const spellHitRateOutput = document.getElementById(
        "spell-hit-rate",
    ) as HTMLSpanElement;

    function recalculate(): void {
        const initialBaseStats = new Stats(
            handleIntInput(strBaseInput, 4, 4),
            handleIntInput(dexBaseInput, 4, 4),
            handleIntInput(intBaseInput, 4, 4),
            handleIntInput(lukBaseInput, 4, 4),
        );

        const level = handleIntInput(levelInput, 8, 30, 200);

        const wepTypeInt = handleIntInput(weaponTypeInput, 30, 30, 44);
        const wepType = (() => {
            if (!(wepTypeInt in WeaponType)) {
                weaponTypeInput.value = "30";

                return WeaponType.OneHandedSword;
            }

            return wepTypeInt as WeaponType;
        })();
        const wepSpeed = handleIntInput(speedInput, 6, 2, 9) as Speed;
        const weapon = new Weapon(
            psm(wepType),
            meleePeriod(wepType, wepSpeed),
        );

        const spellTypeInt = handleIntInput(spellInput, 0, 0, 2321008);
        const spellType = (() => {
            if (!(spellTypeInt in SpellType)) {
                spellInput.value = "0";

                return SpellType.Other;
            }

            return spellTypeInt as SpellType;
        })();
        const spellT = (() => {
            let t = spellPeriod(
                handleIntInput(spellBoosterInput, 0, -2, 0),
                spellType,
                wepSpeed,
            );
            if (t === undefined) {
                console.error(
                    `spellPeriod(${handleIntInput(
                        spellBoosterInput,
                        0,
                        -2,
                        0,
                    )}, ${spellType}, ${wepSpeed}) is undefined`,
                );

                t = 0.81;
            }

            return t;
        })();
        const spell = new Spell(
            handleIntInput(spellBasicAtkInput, 10, 1),
            handleIntInput(masteryInput, 15, 10, 90) / 100,
            spellT,
        );

        const totalWatk = handleIntInput(totalWatkInput, 1, 0);
        const rawMatk = handleIntInput(matkAdditionalInput, 0, 0);
        const rawWacc = handleIntInput(waccAdditionalInput, 0, 0);

        const monster = new Monster(
            handleIntInput(enemyLevelInput, 1, 1),
            handleIntInput(avoidInput, 1, 1),
            handleIntInput(wdefInput, 0),
            handleIntInput(mdefInput, 0),
        );

        const [baseStats, totalStats] = allocateAp(
            handleIntInput(apAvailableInput, 1, 1),
            initialBaseStats,
            new Stats(
                handleIntInput(strAdditionalInput, 0, 0),
                handleIntInput(dexAdditionalInput, 0, 0),
                handleIntInput(intAdditionalInput, 0, 0),
                handleIntInput(lukAdditionalInput, 0, 0),
            ).add(initialBaseStats),
            level,
            weapon,
            spell,
            totalWatk,
            rawMatk,
            rawWacc,
            monster,
            handleFloatInput(wDominanceFactorInput, 2, 1),
        );
        const additionalStats = totalStats.clone().sub(baseStats);

        strOutput.textContent = "" + totalStats.str;
        dexOutput.textContent = "" + totalStats.dex;
        intOutput.textContent = "" + totalStats.int;
        lukOutput.textContent = "" + totalStats.luk;

        strBaseOutput.textContent = "" + baseStats.str;
        dexBaseOutput.textContent = "" + baseStats.dex;
        intBaseOutput.textContent = "" + baseStats.int;
        lukBaseOutput.textContent = "" + baseStats.luk;

        strAdditionalOutput.textContent = "" + additionalStats.str;
        dexAdditionalOutput.textContent = "" + additionalStats.dex;
        intAdditionalOutput.textContent = "" + additionalStats.int;
        lukAdditionalOutput.textContent = "" + additionalStats.luk;

        const d = Math.max(monster.level - level, 0);

        meleeDpsOutput.textContent = wDps(
            totalStats,
            rawWacc,
            totalWatk,
            weapon,
            monster,
            d,
        ).toFixed(3);
        spellDpsOutput.textContent = mDps(
            totalStats,
            rawMatk,
            spell,
            monster,
            d,
        ).toFixed(3);

        meleeHitRateOutput.textContent = (
            100 *
            wHitRate(
                wacc(totalStats.dex, totalStats.luk, rawWacc),
                monster.avoid,
                d,
            )
        ).toFixed(2);
        spellHitRateOutput.textContent = (
            100 * mHitRate(totalStats.int, totalStats.luk, monster.avoid, d)
        ).toFixed(2);
    }

    for (const input of [
        strBaseInput,
        dexBaseInput,
        intBaseInput,
        lukBaseInput,
        strAdditionalInput,
        dexAdditionalInput,
        intAdditionalInput,
        lukAdditionalInput,
        waccAdditionalInput,
        matkAdditionalInput,
        totalWatkInput,
        apAvailableInput,
        levelInput,
        weaponTypeInput,
        speedInput,
        spellInput,
        spellBasicAtkInput,
        spellLinesInput,
        masteryInput,
        spellBoosterInput,
        eleAmpInput,
        eleWepInput,
        wdefInput,
        mdefInput,
        avoidInput,
        eleSusInput,
        enemyLevelInput,
        enemyCountInput,
        wDominanceFactorInput,
    ]) {
        input.addEventListener("change", recalculate);
    }

    recalculate();
}

function handleIntInput(
    input: HTMLInputElement | HTMLSelectElement,
    def: number,
    min: number = Number.NEGATIVE_INFINITY,
    max: number = Number.POSITIVE_INFINITY,
): number {
    let x = Math.min(Math.max(parseInt(input.value, 10), min), max);
    if (!Number.isFinite(x)) {
        x = def;
    }
    input.value = "" + x;

    return x;
}

function handleFloatInput(
    input: HTMLInputElement | HTMLSelectElement,
    def: number,
    min: number = Number.NEGATIVE_INFINITY,
    max: number = Number.POSITIVE_INFINITY,
): number {
    let x = Math.min(Math.max(parseFloat(input.value), min), max);
    if (!Number.isFinite(x)) {
        x = def;
    }
    input.value = "" + x;

    return x;
}
