enum Tier {
  SSR, // Purple
  SR, // Gold
  R, // Blue
  N, // Silver
}

enum ItemTier {
  Purple = 3,
  Gold = 2,
  Blue = 1,
  Silver = 0,
}

interface Reward {
  KarinElef: number
  NeruElef: number
  PurpleAnti: number
  PurpleDisk: number
  YellowAnti: number
  YellowDisk: number
  BlueAnti: number
  BlueDisk: number
  Dice: number
  EquipBox: number
  Credit: number
  Exp: number
  EnchantStone: number
}

const tierRate = [0.1, 0.2, 0.3, 0.4] as const

const expValue = [50, 500, 2000, 10000] as const
const enchantValue = [90, 360, 1440, 5760] as const

const consumeCoin = [200, 210, 220, 230] as const

/**
 * 카드 4개 생성 (전 결과를 참고하여 황금 카드 보정)
 * @returns 카드
 */
function generateCards() {
  const genTier = [Tier.N, Tier.N, Tier.N, Tier.N] as [Tier, Tier, Tier, Tier]
  for (let i = 0; i < 4; i += 1) {
    genTier[i] = generateTier()
    if (i === 3) {
      let hasSR = false
      for (let k = 0; k <= i; k += 1) {
        if (genTier[k] === Tier.SR || genTier[k] === Tier.SSR) {
          hasSR = true
          break
        }
      }
      if (!hasSR) {
        // Force SR
        genTier[randInt(0, i)] = Tier.SR
      }
    }
  }
  return genTier
}

/**
 * 카드 4개 생성 (전 결과와 관련없이 황금 카드 보정)
 * @returns 카드
 */
function generateCards2() {
  const genTier = [Tier.N, Tier.N, Tier.N, Tier.N] as [Tier, Tier, Tier, Tier]
  const forceSRIndex = randInt(0, 3)
  for (let i = 0; i < 4; i += 1) {
    genTier[i] = generateTier()
    if (i === forceSRIndex) {
      if (genTier[i] === Tier.N && genTier[i] === Tier.R) {
        genTier[i] = Tier.SR
      }
    }
  }
  return genTier
}

/**
 * 카드 등급 뽑기
 * @returns 카드 등급
 */
function generateTier() {
  const rand = Math.random()
  let cut = tierRate[0]
  if (rand < cut) return Tier.SSR
  cut += tierRate[1]
  if (rand < cut) return Tier.SR
  cut += tierRate[2]
  if (rand < cut) return Tier.R
  return Tier.N
}

/**
 * [start, end] 사이로 랜덤한 수(시작, 끝 포함)를 생성합니다
 * @param start 최솟값
 * @param end 최댓값
 * @returns 범위 내 랜덤한 숫자
 */
function randInt(start: number, end: number) {
  return Math.floor(Math.random() * (end - start + 1)) + start
}
/**
 * 1K = 1000
 * @param n K
 * @returns 숫자
 */
function K(n: number) {
  return n * 1000
}

/**
 * 카드 종류에 따라 보상을 임의로 생성
 * @param tier 카드 티어
 * @returns 보상
 */
function getReward(tier: Tier): Partial<Reward> {
  switch (tier) {
    case Tier.SSR: {
      const basicReward: Partial<Reward> = {
        Dice: 4,
        EquipBox: 1,
        Credit: K(1000),
      }
      const rand = randInt(0, 3)
      switch (rand) {
        case 0:
          return {
            ...basicReward,
            KarinElef: randInt(12, 18),
            PurpleDisk: 1,
            YellowDisk: randInt(1, 3),
          }
        case 1:
          return {
            ...basicReward,
            NeruElef: randInt(12, 18),
            PurpleDisk: 1,
            YellowDisk: randInt(1, 3),
          }
        case 2:
          return {
            ...basicReward,
            KarinElef: randInt(4, 6),
            NeruElef: randInt(8, 12),
            PurpleAnti: 1,
            YellowAnti: randInt(1, 3),
          }
        case 3:
          return {
            ...basicReward,
            KarinElef: randInt(8, 12),
            NeruElef: randInt(4, 6),
            PurpleAnti: 1,
            YellowAnti: randInt(1, 3),
          }
      }
    } break
    case Tier.SR: {
      const basicReward: Partial<Reward> = {
        Dice: 2,
        EquipBox: 1,
        Credit: [K(100), K(150), K(200)][Math.floor(Math.random() * 3)],
      }
      const rand = randInt(0, 1)
      if (rand === 0) {
        return {
          ...basicReward,
          YellowAnti: 1,
          BlueAnti: 1,
          Exp: expValue[ItemTier.Purple],
        }
      } else if (rand === 1) {
        return {
          ...basicReward,
          YellowDisk: 1,
          BlueDisk: 1,
          EnchantStone: enchantValue[ItemTier.Purple] + enchantValue[ItemTier.Gold] * randInt(1, 3),
        }
      }
    } break
    case Tier.R: {
      return {
        BlueDisk: 1,
        BlueAnti: 1,
        Exp: expValue[ItemTier.Gold] * randInt(1, 3) + expValue[ItemTier.Silver] * randInt(1, 3),
        Dice: 2,
        EquipBox: 1,
        Credit: K(50),
      }
    } break
    case Tier.N: {
      const rand = randInt(0, 5)
      const basicReward: Partial<Reward> = {
        Dice: 1,
        EquipBox: 1,
        Credit: K(20),
      }
      switch (rand) {
        case 0: {
          return {
            ...basicReward,
            BlueAnti: 1,
            EnchantStone: enchantValue[ItemTier.Gold] + enchantValue[ItemTier.Silver] * randInt(10, 12),
          }
        } break
        case 1: {
          return {
            ...basicReward,
            BlueDisk: 1,
            EnchantStone: enchantValue[ItemTier.Gold] * randInt(2, 4) + enchantValue[ItemTier.Silver] * randInt(7, 9),
          }
        } break
        case 2: {
          return {
            ...basicReward,
            BlueAnti: 1,
            EnchantStone: enchantValue[ItemTier.Gold] * randInt(2, 3) + enchantValue[ItemTier.Silver] * randInt(8, 10),
          }
        } break
        case 3: {
          return {
            ...basicReward,
            BlueDisk: 1,
            Exp: expValue[ItemTier.Gold] + expValue[ItemTier.Silver] * randInt(7, 9),
          }
        } break
        case 4: {
          return {
            ...basicReward,
            BlueAnti: 1,
            Exp: expValue[ItemTier.Gold] * randInt(1, 3) + expValue[ItemTier.Silver] * randInt(6, 8),
          }
        } break
        case 5: {
          return {
            ...basicReward,
            BlueDisk: 1,
            Exp: expValue[ItemTier.Gold] + expValue[ItemTier.Silver] * randInt(9, 11),
          }
        } break
      }
    } break
  }
  return {}
}

function simulateCoins(coin: number, decisionFn: (openTries: number, lastCard: Tier) => boolean) {
  let leftCoins = coin
  let currentCards = generateCards2()
  let currentOpen = 0
  const totalRewards: Reward = {
    KarinElef: 0,
    NeruElef: 0,
    PurpleDisk: 0,
    YellowDisk: 0,
    PurpleAnti: 0,
    YellowAnti: 0,
    BlueDisk: 0,
    BlueAnti: 0,
    EnchantStone: 0,
    Exp: 0,
    Dice: 0,
    EquipBox: 0,
    Credit: 0,
  }
  const tierRates = {
    [Tier.SSR]: 0,
    [Tier.SR]: 0,
    [Tier.R]: 0,
    [Tier.N]: 0,
  }
  // 보상 추가
  const addReward = (reward: Partial<Reward>) => {
    totalRewards.KarinElef += reward.KarinElef ?? 0
    totalRewards.NeruElef += reward.NeruElef ?? 0
    totalRewards.PurpleDisk += reward.PurpleDisk ?? 0
    totalRewards.YellowDisk += reward.YellowDisk ?? 0
    totalRewards.PurpleAnti += reward.PurpleAnti ?? 0
    totalRewards.YellowAnti += reward.YellowAnti ?? 0
    totalRewards.BlueDisk += reward.BlueDisk ?? 0
    totalRewards.BlueAnti += reward.BlueAnti ?? 0
    totalRewards.EnchantStone += reward.EnchantStone ?? 0
    totalRewards.Exp += reward.Exp ?? 0
    totalRewards.Dice += reward.Dice ?? 0
    totalRewards.EquipBox += reward.EquipBox ?? 0
    totalRewards.Credit += reward.Credit ?? 0
  }
  while (leftCoins >= consumeCoin[0]) {
    // 1. 코인 인출
    leftCoins -= consumeCoin[currentOpen]
    // 2. 오픈된 카드 티어
    const simulatedTier = currentCards[currentOpen]
    // 3. 보상 획득
    addReward(getReward(simulatedTier))
    // 4. 기록
    tierRates[simulatedTier] += 1
    // 5. 다음 행동 결정
    if (currentOpen >= consumeCoin.length - 1) {
      // 다 써서 다음으로
      currentOpen = 0
      currentCards = generateCards2()
      continue
    }
    // 다음 오픈 결정 (true이면 교체)
    const decision = decisionFn(currentOpen, simulatedTier)
    if (decision || leftCoins <= consumeCoin[currentOpen + 1]) {
      currentOpen = 0
      currentCards = generateCards2()
      continue
    }
    // 다음 카드 열기
    currentOpen += 1
  }
  return {
    ...totalRewards,
    tierRates,
  }
}

function simulateAPs(ap: number, bonus: number, decisionFn: (openTries: number, lastCard: Tier) => boolean) {
  // 15AP = 코인 30개 / 보너스 별도 (보통 40%)
  return simulateCoins(ap * 2 * (1 + bonus), decisionFn)
}

function simulateTimes(times: number, ap: number, bonus: number, decisionFn: (openTries: number, lastCard: Tier) => boolean) {
  const totalRewards: Reward = {
    KarinElef: 0,
    NeruElef: 0,
    PurpleDisk: 0,
    YellowDisk: 0,
    PurpleAnti: 0,
    YellowAnti: 0,
    BlueDisk: 0,
    BlueAnti: 0,
    EnchantStone: 0,
    Exp: 0,
    Dice: 0,
    EquipBox: 0,
    Credit: 0,
  }
  const tierRates = {
    [Tier.SSR]: 0,
    [Tier.SR]: 0,
    [Tier.R]: 0,
    [Tier.N]: 0,
  }
  for (let i = 0; i < times; i += 1) {
    const result = simulateAPs(ap, bonus, decisionFn)
    totalRewards.KarinElef += result.KarinElef
    totalRewards.NeruElef += result.NeruElef
    totalRewards.PurpleDisk += result.PurpleDisk
    totalRewards.YellowDisk += result.YellowDisk
    totalRewards.PurpleAnti += result.PurpleAnti
    totalRewards.YellowAnti += result.YellowAnti
    totalRewards.BlueDisk += result.BlueDisk
    totalRewards.BlueAnti += result.BlueAnti
    totalRewards.EnchantStone += result.EnchantStone
    totalRewards.Exp += result.Exp
    totalRewards.Dice += result.Dice
    totalRewards.EquipBox += result.EquipBox
    totalRewards.Credit += result.Credit
    tierRates[Tier.SSR] += result.tierRates[Tier.SSR]
    tierRates[Tier.SR] += result.tierRates[Tier.SR]
    tierRates[Tier.R] += result.tierRates[Tier.R]
    tierRates[Tier.N] += result.tierRates[Tier.N]
  }
  // make mean
  totalRewards.KarinElef /= times
  totalRewards.NeruElef /= times
  totalRewards.PurpleDisk /= times
  totalRewards.YellowDisk /= times
  totalRewards.PurpleAnti /= times
  totalRewards.YellowAnti /= times
  totalRewards.BlueDisk /= times
  totalRewards.BlueAnti /= times
  totalRewards.EnchantStone /= times
  totalRewards.Exp /= times
  totalRewards.Dice /= times
  totalRewards.EquipBox /= times
  totalRewards.Credit /= times
  tierRates[Tier.SSR] /= times
  tierRates[Tier.SR] /= times
  tierRates[Tier.R] /= times
  tierRates[Tier.N] /= times

  return {
    ...totalRewards,
    tierRates,
  }
}

function printResult(data: ReturnType<typeof simulateCoins>) {
  console.log("============= 시뮬레이션 결과 ==============")
  console.log("카린 엘레프: ", data.KarinElef)
  console.log("네루 엘레프: ", data.NeruElef)
  console.log("크레딧:", data.Credit.toLocaleString())
  console.log("=====================================")
  console.log("강화석 (EXP):", data.EnchantStone)
  console.log("활동보고서 (EXP):", data.Exp)
  console.log("주사위:", data.Dice)
  console.log("상자:", data.EquipBox)
  console.log("=====================================")
  console.log("보라색 디스크:", data.PurpleDisk)
  console.log("노란색 디스크:", data.YellowDisk)
  console.log("보라색 안티:", data.PurpleAnti)
  console.log("노란색 안티:", data.YellowAnti)
  console.log("파란색 디스크:", data.BlueDisk)
  console.log("파란색 안티:", data.BlueAnti)
  console.log("=====================================")
  console.log("SSR 횟수:", data.tierRates[Tier.SSR])
  console.log("SR 횟수:", data.tierRates[Tier.SR])
  console.log("R 횟수:", data.tierRates[Tier.R])
  console.log("N 횟수:", data.tierRates[Tier.N])
  console.log("총 뽑은 수:", data.tierRates[Tier.SSR] + data.tierRates[Tier.SR] + data.tierRates[Tier.R] + data.tierRates[Tier.N])
}

// 설정
const simulateCount = 10000
const AP = 1500 * 7
const coinBonus = 0.4
// 정책
const SRPolicy = (openTries: number, lastCard: Tier) => {
  if (lastCard === Tier.SR || lastCard === Tier.SSR) {
    return true // 새로 뽑기
  }
  return false
}
const firstPolicy = () => {
  return true // 무조건 새로 뽑기
}
const lastPolicy = () => {
  return false // 무조건 다 쓰기
}

// 실행

console.log("* SR 뽑으면 새로 뽑기")
const SRResult = simulateTimes(simulateCount, AP, coinBonus, SRPolicy)
printResult(SRResult)

console.log("\n\n* 첫번째 거 하나 뽑고 새로 뽑기")
const firstResult = simulateTimes(simulateCount, AP, coinBonus, firstPolicy)
printResult(firstResult)

console.log("\n\n* 마지막 까지 뽑고 새로 뽑기")
const lastResult = simulateTimes(simulateCount, AP, coinBonus, lastPolicy)
printResult(lastResult)