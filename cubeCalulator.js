const SOO_CUBE = {
  epic: 0.0085,
};
const JANG_CUBE = {
  unique: 0.0129,
};
const RED_CUBE = {
  unique: 0.02,
  legendary: 0.006,
};
const BLACK_CUBE = {
  unique: 0.035,
  legendary: 0.014,
};
const EDI_CUBE = {
  epic: 0.048,
  unique: 0.02,
  legendary: 0.005,
};

const calculate = probability => {
  const result = [];
  let currProbability = 0;
  let count = 0;
  while (currProbability < 100 * (1 - probability)) {
    count += 1;
    currProbability = Number((1 - Math.pow(1 - probability, count)) * 100);

    const expectation = 10 * (result.length + 1);
    if (currProbability > expectation) {
      result.push(`${count}개`);
    }
  }
  return {result, count: `${count}개`};
};

const results = {
  '수상한 큐브': {
    에픽: calculate(SOO_CUBE.epic),
  },
  '장인의 큐브': {
    유니크: calculate(JANG_CUBE.unique),
  },
  '레드 큐브(명장의 큐브)': {
    유니크: calculate(RED_CUBE.unique),
    레전드리: calculate(RED_CUBE.legendary),
  },
  '블랙 큐브': {
    유니크: calculate(BLACK_CUBE.unique),
    레전드리: calculate(BLACK_CUBE.legendary),
  },
  '에디셔널 큐브': {
    에픽: calculate(EDI_CUBE.epic),
    유니크: calculate(EDI_CUBE.unique),
    레전드리: calculate(EDI_CUBE.legendary),
  },
};

const chart = [];
chart.push('큐브 확률 계산');
chart.push(
  [
    '큐브 종류',
    '큐브 등급',
    ...new Array(9).fill(null).map((v, index) => `${index + 1}0%`),
  ].join(','),
);
Object.keys(results).forEach(cube => {
  const currCube = results[cube];
  Object.keys(currCube).forEach(grade => {
    chart.push([cube, grade, ...currCube[grade].result].join(','));
  });
});
chart.push('');
chart.push('큐브 1개 사용으로 등급업과 동급으로 실패할 확률 사용 갯수');
Object.keys(results).forEach(cube => {
  const currCube = results[cube];
  Object.keys(currCube).forEach(grade => {
    chart.push([cube, grade, currCube[grade].count].join(','));
  });
});
