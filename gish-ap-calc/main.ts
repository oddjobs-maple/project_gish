class Stats {
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

class Weapon {
    public constructor(public psm: number, public period: number) {}
}

class Spell {
    public constructor(
        public basicAtk: number,
        public mastery: number,
        public period: number,
    ) {}
}

class Monster {
    public constructor(
        public level: number,
        public avoid: number,
        public wdef: number,
        public mdef: number,
    ) {}
}

function allocateAp(
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
): [Stats, Stats] {
    const baseStats = initialBaseStats.clone();
    const stats = initialStats.clone();
    const d = Math.max(monster.level - level, 0);

    while (ap !== 0) {
        const tma = stats.int + rawMatk;

        const wacc = 0.8 * stats.dex + 0.5 * stats.luk + rawWacc;
        const wHitRate = Math.min(
            Math.max(wacc / ((1.84 + 0.07 * d) * monster.avoid) - 1, 0),
            1,
        );

        const preMacc =
            ((Math.trunc(stats.luk / 10) + Math.trunc(stats.int / 10)) /
                (monster.avoid + 1)) *
            (1 + 0.0415 * d);
        const mHitRate = Math.min(
            Math.max(
                -2.5795 * preMacc * preMacc + 5.2343 * preMacc - 1.6749,
                0,
            ),
            1,
        );

        const rawSpellMax =
            (((tma * tma) / 1000 + tma) / 30 + stats.int / 200) *
            spell.basicAtk;
        const rawSpellMin =
            (((tma * tma) / 1000 + tma * spell.mastery * 0.9) / 30 +
                stats.int / 200) *
            spell.basicAtk;
        const spellMax = rawSpellMax - monster.mdef * 0.5 * (1 + 0.01 * d);
        const spellMin = rawSpellMin - monster.mdef * 0.6 * (1 + 0.01 * d);
        const spellAvg = (spellMax + spellMin) / 2;
        const spellDps = (spellAvg / spell.period) * mHitRate;

        const rawMeleeMax =
            ((stats.str * weapon.psm + stats.dex) * totalWatk) / 100;
        const rawMeleeMin =
            ((stats.str * weapon.psm * 0.9 * 0.1 + stats.dex) * totalWatk) /
            100;
        const meleeMax = rawMeleeMax * (1 - 0.01 * d) - monster.wdef * 0.5;
        const meleeMin = rawMeleeMin * (1 - 0.01 * d) - monster.wdef * 0.6;
        const meleeAvg = (meleeMax + meleeMin) / 2;
        const meleeDps = (meleeAvg / weapon.period) * wHitRate;

        const lukResidue = (() => {
            const r = stats.luk % 10;
            if (r === 0) {
                return 10;
            } else {
                return r;
            }
        })();
        const intResidue = (() => {
            const r = stats.int % 10;
            if (r === 0) {
                return 10;
            } else {
                return r;
            }
        })();

        if (wHitRate < 0.95) {
            ++baseStats.luk;
            ++stats.luk;
            --ap;
        } else if (baseStats.str + baseStats.dex < baseStats.int) {
            ++baseStats.str;
            ++stats.str;
            --ap;
        } else if (meleeDps < spellDps * (4 / 3)) {
            ++stats.luk;
            const waccLukAdd = 0.8 * stats.dex + 0.5 * stats.luk + rawWacc;
            const wHitRateLukAdd = Math.min(
                Math.max(
                    waccLukAdd / ((1.84 + 0.07 * d) * monster.avoid) - 1,
                    0,
                ),
                1,
            );

            const rawMeleeMaxLukAdd =
                ((stats.str * weapon.psm + stats.dex) * totalWatk) / 100;
            const rawMeleeMinLukAdd =
                ((stats.str * weapon.psm * 0.9 * 0.1 + stats.dex) *
                    totalWatk) /
                100;
            const meleeMaxLukAdd =
                rawMeleeMaxLukAdd * (1 - 0.01 * d) - monster.wdef * 0.5;
            const meleeMinLukAdd =
                rawMeleeMinLukAdd * (1 - 0.01 * d) - monster.wdef * 0.6;
            const meleeAvgLukAdd = (meleeMaxLukAdd + meleeMinLukAdd) / 2;
            const meleeDpsLukAdd =
                (meleeAvgLukAdd / weapon.period) * wHitRateLukAdd;
            --stats.luk;

            ++stats.str;
            const waccStrAdd = 0.8 * stats.dex + 0.5 * stats.luk + rawWacc;
            const wHitRateStrAdd = Math.min(
                Math.max(
                    waccStrAdd / ((1.84 + 0.07 * d) * monster.avoid) - 1,
                    0,
                ),
                1,
            );

            const rawMeleeMaxStrAdd =
                ((stats.str * weapon.psm + stats.dex) * totalWatk) / 100;
            const rawMeleeMinStrAdd =
                ((stats.str * weapon.psm * 0.9 * 0.1 + stats.dex) *
                    totalWatk) /
                100;
            const meleeMaxStrAdd =
                rawMeleeMaxStrAdd * (1 - 0.01 * d) - monster.wdef * 0.5;
            const meleeMinStrAdd =
                rawMeleeMinStrAdd * (1 - 0.01 * d) - monster.wdef * 0.6;
            const meleeAvgStrAdd = (meleeMaxStrAdd + meleeMinStrAdd) / 2;
            const meleeDpsStrAdd =
                (meleeAvgStrAdd / weapon.period) * wHitRateStrAdd;
            --stats.str;

            if (meleeDpsStrAdd > meleeDpsLukAdd) {
                ++baseStats.str;
                ++stats.str;
            } else {
                ++baseStats.luk;
                ++stats.luk;
            }
            --ap;
        } else {
            if (ap > lukResidue || ap > intResidue) {
                stats.luk += lukResidue;
                const preMaccLukAdd =
                    ((Math.trunc(stats.luk / 10) +
                        Math.trunc(stats.int / 10)) /
                        (monster.avoid + 1)) *
                    (1 + 0.0415 * d);
                const mHitRateLukAdd = Math.min(
                    Math.max(
                        -2.5795 * preMaccLukAdd * preMaccLukAdd +
                            5.2343 * preMaccLukAdd -
                            1.6749,
                        0,
                    ),
                    1,
                );

                const rawSpellMaxLukAdd =
                    (((tma * tma) / 1000 + tma) / 30 + stats.int / 200) *
                    spell.basicAtk;
                const rawSpellMinLukAdd =
                    (((tma * tma) / 1000 + tma * spell.mastery * 0.9) / 30 +
                        stats.int / 200) *
                    spell.basicAtk;
                const spellMaxLukAdd =
                    rawSpellMaxLukAdd - monster.mdef * 0.5 * (1 + 0.01 * d);
                const spellMinLukAdd =
                    rawSpellMinLukAdd - monster.mdef * 0.6 * (1 + 0.01 * d);
                const spellAvgLukAdd = (spellMaxLukAdd + spellMinLukAdd) / 2;
                const spellDpsLukAdd =
                    (spellAvgLukAdd / spell.period) * mHitRateLukAdd;
                stats.luk -= lukResidue;

                stats.int += intResidue;
                const preMaccIntAdd =
                    ((Math.trunc(stats.luk / 10) +
                        Math.trunc(stats.int / 10)) /
                        (monster.avoid + 1)) *
                    (1 + 0.0415 * d);
                const mHitRateIntAdd = Math.min(
                    Math.max(
                        -2.5795 * preMaccIntAdd * preMaccIntAdd +
                            5.2343 * preMaccIntAdd -
                            1.6749,
                        0,
                    ),
                    1,
                );

                const rawSpellMaxIntAdd =
                    (((tma * tma) / 1000 + tma) / 30 + stats.int / 200) *
                    spell.basicAtk;
                const rawSpellMinIntAdd =
                    (((tma * tma) / 1000 + tma * spell.mastery * 0.9) / 30 +
                        stats.int / 200) *
                    spell.basicAtk;
                const spellMaxIntAdd =
                    rawSpellMaxIntAdd - monster.mdef * 0.5 * (1 + 0.01 * d);
                const spellMinIntAdd =
                    rawSpellMinIntAdd - monster.mdef * 0.6 * (1 + 0.01 * d);
                const spellAvgIntAdd = (spellMaxIntAdd + spellMinIntAdd) / 2;
                const spellDpsIntAdd =
                    (spellAvgIntAdd / spell.period) * mHitRateIntAdd;
                stats.int -= intResidue;

                if (spellDpsIntAdd > spellDpsLukAdd) {
                    const apToSpend = Math.min(intResidue, ap);

                    baseStats.int += apToSpend;
                    stats.int += apToSpend;
                    ap -= apToSpend;
                } else {
                    const apToSpend = Math.min(lukResidue, ap);

                    baseStats.luk += apToSpend;
                    stats.luk += apToSpend;
                    ap -= apToSpend;
                }
            } else {
                ++baseStats.int;
                ++stats.int;
                --ap;
            }
        }
    }

    return [baseStats, stats];
}
