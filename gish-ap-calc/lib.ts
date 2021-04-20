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

import { mDps, wacc, wDps, wHitRate } from "./mechanics.js";
import { Monster, Spell, Stats, Weapon } from "./types.js";

export function allocateAp(
    ap: number,
    initialBaseStats: Stats,
    initialStats: Stats,
    level: number,
    weapon: Weapon,
    spell: Spell,
    totalWatk: number,
    rawMatk: number,
    rawWacc: number,
    monster: Monster,
    wDominanceFactor: number,
): [Stats, Stats] {
    const baseStats = initialBaseStats.clone();
    const stats = initialStats.clone();
    const d = Math.max(monster.level - level, 0);

    while (ap !== 0) {
        const physHitRate = wHitRate(
            wacc(stats.dex, stats.luk, rawWacc),
            monster.avoid,
            d,
        );
        if (physHitRate < 0.95) {
            ++baseStats.luk;
            ++stats.luk;
            --ap;

            continue;
        }
        if (baseStats.str + baseStats.dex < baseStats.int) {
            ++baseStats.str;
            ++stats.str;
            --ap;

            continue;
        }

        const spellDps = mDps(stats, rawMatk, spell, monster, d);
        const meleeDps = wDps(stats, rawWacc, totalWatk, weapon, monster, d);

        if (meleeDps < spellDps * wDominanceFactor) {
            ++stats.str;
            const meleeDpsStrAdd = wDps(
                stats,
                rawWacc,
                totalWatk,
                weapon,
                monster,
                d,
            );
            --stats.str;

            ++stats.luk;
            const meleeDpsLukAdd = wDps(
                stats,
                rawWacc,
                totalWatk,
                weapon,
                monster,
                d,
            );
            --stats.luk;

            if (meleeDpsStrAdd > meleeDpsLukAdd) {
                ++baseStats.str;
                ++stats.str;
            } else {
                ++baseStats.luk;
                ++stats.luk;
            }
            --ap;

            continue;
        }

        const lukToNextTen = 10 - (stats.luk % 10);

        stats.int += lukToNextTen;
        const spellDpsIntAdd = mDps(stats, rawMatk, spell, monster, d);
        stats.int -= lukToNextTen;

        stats.luk += lukToNextTen;
        const spellDpsLukAdd = mDps(stats, rawMatk, spell, monster, d);
        stats.luk -= lukToNextTen;

        if (spellDpsIntAdd > spellDpsLukAdd) {
            ++baseStats.int;
            ++stats.int;
        } else {
            ++baseStats.luk;
            ++stats.luk;
        }
        --ap;
    }

    return [baseStats, stats];
}
