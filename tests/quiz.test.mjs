import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  AXES,
  BIRD_TYPES,
  BIRDS,
  displayOptions,
  partnerOf,
  QUESTIONS,
  scoreQuiz,
} from "../app/lib/quiz.ts";

const publicRoot = new URL("../public/", import.meta.url);
const flipCode = (code) => [...code].map((pole) => (pole === "+" ? "-" : "+")).join("");

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

test("keeps a balanced 24-question, four-choice quiz", () => {
  assert.equal(QUESTIONS.length, 24);
  assert.deepEqual(QUESTIONS.map((question) => question.id), Array.from({ length: 24 }, (_, index) => index + 1));
  for (const axis of AXES) {
    assert.equal(QUESTIONS.filter((question) => question.axis === axis.id).length, 6, axis.id);
  }
  for (const question of QUESTIONS) {
    assert.deepEqual(question.options.map((option) => option.value), [-2, -1, 1, 2], `Q${question.id}`);
  }
});

test("interleaves the four axes so no axis repeats back to back", () => {
  QUESTIONS.slice(1).forEach((question, index) => {
    assert.notEqual(question.axis, QUESTIONS[index].axis, `Q${question.id}`);
  });
});

test("alternates option order so always picking A does not decide the type", () => {
  const reversed = QUESTIONS.filter((_, index) => displayOptions(index)[0].value === 2).length;
  assert.equal(reversed, 12);

  for (const position of [0, 3]) {
    const answers = QUESTIONS.map((_, index) => displayOptions(index)[position].value);
    const { code } = scoreQuiz(answers);
    assert.notEqual(code, "----");
    assert.notEqual(code, "++++");
  }
});

test("maps every four-axis combination to exactly one bird", () => {
  assert.equal(BIRD_TYPES.length, 16);
  assert.equal(new Set(BIRD_TYPES.map((bird) => bird.code)).size, 16);
  assert.equal(new Set(BIRD_TYPES.map((bird) => bird.id)).size, 16);
  assert.deepEqual(BIRD_TYPES.map((bird) => bird.number), Array.from({ length: 16 }, (_, index) => index + 1));
  for (const bird of BIRD_TYPES) {
    assert.match(bird.code, /^[+-]{4}$/);
    assert.equal(BIRDS[bird.code], bird);
    assert.equal(bird.traits.length, 3);
    for (const field of ["name", "english", "species", "speciesEnglish", "tagline", "body", "birdNote", "watchOut"]) {
      assert.ok(bird[field].trim().length > 0, `${bird.id}.${field}`);
    }
  }
});

test("scores clear answers to the expected poles and strengths", () => {
  const plus = scoreQuiz(Array(24).fill(2));
  assert.equal(plus.code, "++++");
  assert.ok(plus.axes.every((axis) => axis.strength === 100));

  const minus = scoreQuiz(Array(24).fill(-1));
  assert.equal(minus.code, "----");
  assert.ok(minus.axes.every((axis) => axis.strength === 75));
});

test("breaks a tie with the last answered question of that axis", () => {
  const answers = QUESTIONS.map((question) => (question.axis === "pace" ? 0 : 2));
  const paceIndexes = QUESTIONS.flatMap((question, index) => (question.axis === "pace" ? [index] : []));

  [1, -1, 1, -1, -1, 1].forEach((value, order) => { answers[paceIndexes[order]] = value; });
  const endsPlus = scoreQuiz(answers);
  assert.equal(endsPlus.axes[0].score, 0);
  assert.equal(endsPlus.axes[0].strength, 50);
  assert.equal(endsPlus.code[0], "+");

  [1, -1, 1, -1, 1, -1].forEach((value, order) => { answers[paceIndexes[order]] = value; });
  assert.equal(scoreQuiz(answers).code[0], "-");
});

test("treats both poles symmetrically, including ties", () => {
  const random = seededRandom(20261009);
  const values = [-2, -1, 1, 2];
  for (let run = 0; run < 3000; run += 1) {
    const answers = QUESTIONS.map(() => values[Math.floor(random() * 4)]);
    const { code } = scoreQuiz(answers);
    assert.equal(scoreQuiz(answers.map((value) => -value)).code, flipCode(code));
  }
});

test("pairs every bird with a different partner, and the pairing is mutual", () => {
  for (const bird of BIRD_TYPES) {
    const partner = partnerOf(bird);
    assert.notEqual(partner.code, bird.code);
    assert.equal(partnerOf(partner).code, bird.code);
    assert.equal(partner.code[1], bird.code[1]);
    assert.equal(partner.code[3], bird.code[3]);
  }
});

test("ships every bird scene as web copies (and checks local 2048px masters when present)", async () => {
  const masterDir = new URL("../art/birds-v3/", import.meta.url);
  const hasMasters = await access(masterDir).then(() => true, () => false);

  await Promise.all(BIRD_TYPES.map(async (bird) => {
    assert.equal(bird.image, `/birds-v3/${bird.id}.jpg`);
    await access(new URL(`birds-v3/${bird.id}.jpg`, publicRoot));
    for (const width of [480, 960]) {
      await access(new URL(`birds-v3/web/${bird.id}-${width}.webp`, publicRoot));
    }
    if (!hasMasters) return;
    // 原图只保存在作者本机（不入库），存在时核对尺寸。
    const png = await readFile(new URL(`${bird.id}.png`, masterDir));
    assert.equal(png.subarray(1, 4).toString("ascii"), "PNG");
    assert.equal(png.readUInt32BE(16), 2048, `${bird.id} master width`);
    assert.equal(png.readUInt32BE(20), 2048, `${bird.id} master height`);
  }));
});
