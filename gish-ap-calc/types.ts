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

export class Monster {
    public constructor(
        public level: number,
        public avoid: number,
        public wdef: number,
        public mdef: number,
    ) {}
}

export class Spell {
    public constructor(
        public basicAtk: number,
        public mastery: number,
        public period: number,
    ) {}
}

export class Stats {
    public constructor(
        public str: number,
        public dex: number,
        public int: number,
        public luk: number,
    ) {}

    public clone(): Stats {
        return new Stats(this.str, this.dex, this.int, this.luk);
    }

    /** Operates **in-place** and then returns `this`. */
    public add(other: Stats): Stats {
        this.str += other.str;
        this.dex += other.dex;
        this.int += other.int;
        this.luk += other.luk;

        return this;
    }

    /** Operates **in-place** and then returns `this`. */
    public sub(other: Stats): Stats {
        this.str -= other.str;
        this.dex -= other.dex;
        this.int -= other.int;
        this.luk -= other.luk;

        return this;
    }
}

export class Weapon {
    public constructor(public psm: number, public period: number) {}
}

export enum WeaponType {
    OneHandedSword = 30,
    OneHandedAxe = 31,
    OneHandedMace = 32,
    Dagger = 33,
    Wand = 37,
    Staff = 38,
    TwoHandedSword = 40,
    TwoHandedAxe = 41,
    TwoHandedMace = 42,
    Spear = 43,
    Polearm = 44,
}

export const enum Speed {
    Faster2 = 2,
    Faster3 = 3,
    Fast4 = 4,
    Fast5 = 5,
    Normal = 6,
    Slow7 = 7,
    Slow8 = 8,
    Slower = 9,
}

export enum SpellType {
    Other = 0,
    Explosion = 2111002,
    PoisonMist = 2111003,
    ElementCompositionFP = 2111006,
    Elquines = 2121005,
    MeteorShower = 2121007,
    IceStrike = 2211002,
    ThunderSpear = 2211003,
    ElementCompositionIL = 2211006,
    Ifrit = 2221005,
    ChainLightning = 2221006,
    Blizzard = 2221007,
    Heal = 2301002,
    HolyArrow = 2301005,
    ShiningRay = 2311004,
    SummonDragon = 2311006,
    Bahamut = 2321003,
    AngelRay = 2321007,
    Genesis = 2321008,
}
