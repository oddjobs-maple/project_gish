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
}

export class Weapon {
    public constructor(public psm: number, public period: number) {}
}
