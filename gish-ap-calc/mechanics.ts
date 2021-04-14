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

export function wacc(dex: number, luk: number, rawWacc: number): number {
    return 0.8 * dex + 0.5 * luk + rawWacc;
}

export function wHitRate(wacc: number, avoid: number, d: number): number {
    return Math.min(Math.max(wacc / ((1.84 + 0.07 * d) * avoid) - 1, 0), 1);
}

/**
 * Special-sauce formula: "Magical Accuracy: Thikket and Nekonecat's version",
 * due to Technolink/Russt/AyumiLove.
 *
 * <https://ayumilovemaple.wordpress.com/2009/09/06/maplestory-formula-compilation/>
 */
export function mHitRate(
    int: number,
    luk: number,
    avoid: number,
    d: number,
): number {
    const preMacc =
        ((Math.trunc(int / 10) + Math.trunc(luk / 10)) / (avoid + 1)) *
        (1 + 0.0415 * d);

    return Math.min(
        Math.max(-2.5795 * preMacc * preMacc + 5.2343 * preMacc - 1.6749, 0),
        1,
    );
}

export function rawWDmg(
    str: number,
    dex: number,
    totalWatk: number,
    psm: number,
): [number, number] {
    const adjustedStr = str * psm;
    const adjustedWatk = totalWatk / 100;

    return [
        (adjustedStr * 0.09 + dex) * adjustedWatk,
        (adjustedStr + dex) * adjustedWatk,
    ];
}

export function wDmgAfterDef(
    rawMin: number,
    rawMax: number,
    wdef: number,
    d: number,
): [number, number] {
    const lvlFactor = 1 - 0.01 * d;

    return [rawMin * lvlFactor - wdef * 0.6, rawMax * lvlFactor - wdef * 0.5];
}

export function rawMDmg(
    tma: number,
    int: number,
    basicAtk: number,
    mastery: number,
): [number, number] {
    const quadraticTerm = (tma * tma) / 1000;
    const intTerm = int / 200;

    return [
        ((quadraticTerm + tma * mastery * 0.9) / 30 + intTerm) * basicAtk,
        ((quadraticTerm + tma) / 30 + intTerm) * basicAtk,
    ];
}

export function mDmgAfterDef(
    rawMin: number,
    rawMax: number,
    mdef: number,
    d: number,
): [number, number] {
    const adjustedMdef = mdef * (1 + 0.01 * d);

    return [rawMin - adjustedMdef * 0.6, rawMax - adjustedMdef * 0.5];
}
