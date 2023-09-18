export const questionsFromRelevance: {
  document_id: string
  insert_date_: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  starting_code: string
  test_cases: { args: any[]; expected: any }[]
}[] = [
  {
    document_id: "01f11d1c-2e50-432c-86d0-7fef0d2a078a",
    description:
      "You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees (clockwise).",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Rotate Image",
    starting_code: "def solution(matrix):\n    return None",
    test_cases: [
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        ],
        expected: [
          [7, 4, 1],
          [8, 5, 2],
          [9, 6, 3],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [3, 4],
          ],
        ],
        expected: [
          [3, 1],
          [4, 2],
        ],
      },
      {
        args: [
          [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16],
          ],
        ],
        expected: [
          [13, 9, 5, 1],
          [14, 10, 6, 2],
          [15, 11, 7, 3],
          [16, 12, 8, 4],
        ],
      },
      {
        args: [[[1]]],
        expected: [[1]],
      },
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
        ],
        expected: [
          [4, 1],
          [5, 2],
          [6, 3],
        ],
      },
      {
        args: [
          [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
            [21, 22, 23, 24, 25],
          ],
        ],
        expected: [
          [21, 16, 11, 6, 1],
          [22, 17, 12, 7, 2],
          [23, 18, 13, 8, 3],
          [24, 19, 14, 9, 4],
          [25, 20, 15, 10, 5],
        ],
      },
      {
        args: [
          [
            [1, 2, 3, 4, 5, 6],
            [7, 8, 9, 10, 11, 12],
            [13, 14, 15, 16, 17, 18],
            [19, 20, 21, 22, 23, 24],
            [25, 26, 27, 28, 29, 30],
            [31, 32, 33, 34, 35, 36],
          ],
        ],
        expected: [
          [31, 25, 19, 13, 7, 1],
          [32, 26, 20, 14, 8, 2],
          [33, 27, 21, 15, 9, 3],
          [34, 28, 22, 16, 10, 4],
          [35, 29, 23, 17, 11, 5],
          [36, 30, 24, 18, 12, 6],
        ],
      },
      {
        args: [
          [
            [1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19, 20, 21],
            [22, 23, 24, 25, 26, 27, 28],
            [29, 30, 31, 32, 33, 34, 35],
            [36, 37, 38, 39, 40, 41, 42],
            [43, 44, 45, 46, 47, 48, 49],
          ],
        ],
        expected: [
          [43, 36, 29, 22, 15, 8, 1],
          [44, 37, 30, 23, 16, 9, 2],
          [45, 38, 31, 24, 17, 10, 3],
          [46, 39, 32, 25, 18, 11, 4],
          [47, 40, 33, 26, 19, 12, 5],
          [48, 41, 34, 27, 20, 13, 6],
          [49, 42, 35, 28, 21, 14, 7],
        ],
      },
    ],
  },
  {
    document_id: "042323f6-5971-4574-9a1d-cf71ddab9658",
    description:
      "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*'.",
    difficulty: "hard",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Wildcard Matching",
    starting_code: "def solution(s, p):\n  return None",
    test_cases: [
      {
        args: ["aa", "a"],
        expected: false,
      },
      {
        args: ["aa", "*"],
        expected: true,
      },
      {
        args: ["cb", "?a"],
        expected: false,
      },
      {
        args: ["adceb", "*a*b"],
        expected: true,
      },
      {
        args: ["acdcb", "a*c?b"],
        expected: false,
      },
      {
        args: ["", "*"],
        expected: true,
      },
      {
        args: ["", ""],
        expected: true,
      },
      {
        args: ["abc", "abc"],
        expected: true,
      },
      {
        args: ["abc", "a*c"],
        expected: true,
      },
      {
        args: ["abc", "a?c"],
        expected: true,
      },
      {
        args: ["abc", "a?b"],
        expected: false,
      },
      {
        args: ["abc", "a?bc"],
        expected: false,
      },
      {
        args: ["abc", "a?b*d"],
        expected: false,
      },
    ],
  },
  {
    document_id: "084d8b79-d148-4533-9584-93c1646e938c",
    description:
      "Given an array nums and a value val, remove all instances of that value in-place and return the new length.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Remove Element",
    starting_code: "def solution(nums, val):\n    return None",
    test_cases: [
      {
        args: [[3, 2, 2, 3], 3],
        expected: 2,
      },
      {
        args: [[0, 1, 2, 2, 3, 0, 4, 2], 2],
        expected: 5,
      },
      {
        args: [[1, 2, 3, 4, 5], 6],
        expected: 5,
      },
      {
        args: [[], 9],
        expected: 0,
      },
      {
        args: [[1, 2, 3, 4, 5], 1],
        expected: 4,
      },
      {
        args: [[1, 1, 1, 1, 1], 1],
        expected: 0,
      },
      {
        args: [[-1, -2, -3, -4, -5], -1],
        expected: 4,
      },
      {
        args: [[1, 2, 3, 4, 5], 0],
        expected: 5,
      },
      {
        args: [[1, 2, 3, 4, 5], 5],
        expected: 4,
      },
      {
        args: [[1, 2, 3, 4, 5], 4],
        expected: 4,
      },
    ],
  },
  {
    document_id: "0ce691cc-1f3e-4d09-9ef0-cc2c62ebcfe2",
    description:
      "Given a set of candidate numbers (candidates) (without duplicates) and a target number (target), find all unique combinations in candidates where the candidate numbers sums to target.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Combination Sum",
    starting_code: "def solution(candidates, target):\n  return None",
    test_cases: [
      {
        args: [[2, 3, 6, 7], 7],
        expected: [[2, 2, 3], [7]],
      },
      {
        args: [[2, 3, 5], 8],
        expected: [
          [2, 2, 2, 2],
          [2, 3, 3],
          [3, 5],
        ],
      },
      {
        args: [[2, 4, 6, 8], 10],
        expected: [
          [2, 2, 2, 2, 2],
          [2, 2, 2, 4],
          [2, 4, 4],
          [2, 8],
          [4, 6],
        ],
      },
      {
        args: [[1, 2, 3, 4, 5], 9],
        expected: [
          [1, 2, 2, 4],
          [1, 2, 3, 3],
          [1, 4, 4],
          [2, 2, 2, 3],
          [2, 3, 4],
          [3, 3, 3],
          [3, 6],
          [4, 5],
        ],
      },
      {
        args: [[], 9],
        expected: [],
      },
      {
        args: [[1, 2, 3, 4, 5], 10],
        expected: [],
      },
      {
        args: [[1, 1, 1, 1, 1], 2],
        expected: [[1, 1]],
      },
      {
        args: [[-1, -2, -3, -4, -5], -8],
        expected: [
          [-1, -1, -1, -1, -1],
          [-1, -1, -1, -2],
          [-1, -1, -2, -4],
          [-1, -2, -5],
          [-2, -3, -3],
          [-3, -5],
        ],
      },
    ],
  },
  {
    document_id: "16eea9ad-405f-44c5-90e1-62a86b2352a3",
    description:
      "Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Implement string includes",
    starting_code: "def solution(haystack, needle):\n  return None",
    test_cases: [
      {
        args: ["hello", "ll"],
        expected: 2,
      },
      {
        args: ["hello", "o"],
        expected: 4,
      },
      {
        args: ["hello", "h"],
        expected: 0,
      },
      {
        args: ["hello", "z"],
        expected: -1,
      },
      {
        args: ["", "a"],
        expected: -1,
      },
      {
        args: ["abcdefg", "efg"],
        expected: 4,
      },
      {
        args: ["abcdefg", "abcd"],
        expected: 0,
      },
      {
        args: ["abcdefg", "g"],
        expected: 6,
      },
      {
        args: ["abcdefg", "abcdefg"],
        expected: 0,
      },
      {
        args: ["abcdefg", "abcdefgh"],
        expected: -1,
      },
    ],
  },
  {
    document_id: "22b1542f-1f65-4873-a364-f46b860ef538",
    description:
      "Given an array of integers and an integer K, you need to find the total number of continuous subarrays whose sum equals to K.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Subarray Sum Equals K",
    starting_code: "def solution(nums, k):\n  return None",
    test_cases: [
      {
        args: [[1, 1, 1], 2],
        expected: 2,
      },
      {
        args: [[1, 2, 3], 3],
        expected: 2,
      },
      {
        args: [[-1, -2, -3], -3],
        expected: 2,
      },
      {
        args: [[1, 2, 3, 4, 5], 9],
        expected: 2,
      },
      {
        args: [[], 0],
        expected: 0,
      },
      {
        args: [[1, 2, 3, 4, 5], 0],
        expected: 0,
      },
      {
        args: [[1, 1, 1, 1, 1], 1],
        expected: 5,
      },
      {
        args: [[-1, -2, -3, -4, -5], -5],
        expected: 5,
      },
      {
        args: [[-1, -2, -3, -4, -5], 0],
        expected: 0,
      },
      {
        args: [[-1, -2, -3, -4, -5], -15],
        expected: 1,
      },
    ],
  },
  {
    document_id: "23c946f3-bba0-4e64-9c9f-1c77246ea411",
    description:
      "Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "3Sum",
    starting_code: "def solution(nums):\n  return None",
    test_cases: [
      {
        args: [[-1, 0, 1, 2, -1, -4]],
        expected: [
          [-1, -1, 2],
          [-1, 0, 1],
        ],
      },
      {
        args: [[1, 2, -2, -1]],
        expected: [],
      },
      {
        args: [[0, 0, 0, 0]],
        expected: [[0, 0, 0]],
      },
      {
        args: [[1, 2, 3, 4, 5]],
        expected: [],
      },
      {
        args: [[-1, -2, -3, -4, -5]],
        expected: [],
      },
      {
        args: [[-1, 0, 1, 2, -1, -4, 3, 4, 5, 6, 7, 8, 9, 10]],
        expected: [
          [-4, 0, 4],
          [-4, 1, 3],
          [-3, -1, 4],
          [-3, 0, 3],
          [-3, 1, 2],
          [-2, -1, 3],
          [-2, 0, 2],
          [-1, -1, 2],
          [-1, 0, 1],
        ],
      },
      {
        args: [
          [-1, 0, 1, 2, -1, -4, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        ],
        expected: [
          [-20, 0, 20],
          [-20, 1, 19],
          [-20, 2, 18],
          [-20, 3, 17],
          [-20, 4, 16],
          [-20, 5, 15],
          [-20, 6, 14],
          [-20, 7, 13],
          [-20, 8, 12],
          [-20, 9, 11],
          [-20, 10, 10],
          [-19, -1, 20],
          [-19, 0, 19],
          [-19, 1, 18],
          [-19, 2, 17],
          [-19, 3, 16],
          [-19, 4, 15],
          [-19, 5, 14],
          [-19, 6, 13],
          [-19, 7, 12],
          [-19, 8, 11],
          [-19, 9, 10],
          [-18, -2, 20],
          [-18, -1, 19],
          [-18, 0, 18],
          [-18, 1, 17],
          [-18, 2, 16],
          [-18, 3, 15],
          [-18, 4, 14],
          [-18, 5, 13],
          [-18, 6, 12],
          [-18, 7, 11],
          [-18, 8, 10],
          [-17, -3, 20],
          [-17, -2, 19],
          [-17, -1, 18],
          [-17, 0, 17],
          [-17, 1, 16],
          [-17, 2, 15],
          [-17, 3, 14],
          [-17, 4, 13],
          [-17, 5, 12],
          [-17, 6, 11],
          [-17, 7, 10],
          [-16, -4, 20],
          [-16, -3, 19],
          [-16, -2, 18],
          [-16, -1, 17],
          [-16, 0, 16],
          [-16, 1, 15],
          [-16, 2, 14],
          [-16, 3, 13],
          [-16, 4, 12],
          [-16, 5, 11],
          [-16, 6, 10],
          [-15, -5, 20],
          [-15, -4, 19],
          [-15, -3, 18],
          [-15, -2, 17],
          [-15, -1, 16],
          [-15, 0, 15],
          [-15, 1, 14],
          [-15, 2, 13],
          [-15, 3, 12],
          [-15, 4, 11],
          [-15, 5, 10],
          [-14, -6, 20],
          [-14, -5, 19],
          [-14, -4, 18],
          [-14, -3, 17],
          [-14, -2, 16],
          [-14, -1, 15],
          [-14, 0, 14],
          [-14, 1, 13],
          [-14, 2, 12],
          [-14, 3, 11],
          [-14, 4, 10],
          [-13, -7, 20],
          [-13, -6, 19],
          [-13, -5, 18],
          [-13, -4, 17],
          [-13, -3, 16],
          [-13, -2, 15],
          [-13, -1, 14],
          [-13, 0, 13],
          [-13, 1, 12],
          [-13, 2, 11],
          [-13, 3, 10],
          [-12, -8, 20],
          [-12, -7, 19],
          [-12, -6, 18],
          [-12, -5, 17],
          [-12, -4, 16],
          [-12, -3, 15],
          [-12, -2, 14],
          [-12, -1, 13],
          [-12, 0, 12],
          [-12, 1, 11],
          [-12, 2, 10],
          [-11, -9, 20],
          [-11, -8, 19],
          [-11, -7, 18],
          [-11, -6, 17],
          [-11, -5, 16],
          [-11, -4, 15],
          [-11, -3, 14],
          [-11, -2, 13],
          [-11, -1, 12],
          [-11, 0, 11],
          [-11, 1, 10],
          [-10, -10, 20],
          [-10, -9, 19],
          [-10, -8, 18],
          [-10, -7, 17],
          [-10, -6, 16],
          [-10, -5, 15],
          [-10, -4, 14],
          [-10, -3, 13],
          [-10, -2, 12],
          [-10, -1, 11],
          [-10, 0, 10],
        ],
      },
    ],
  },
  {
    document_id: "29c3f3bd-c5d9-4650-9428-12d524d43652",
    description: "Given a collection of intervals, merge all overlapping intervals.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Merge Intervals",
    starting_code: "def solution(intervals):\n  return None",
    test_cases: [
      {
        args: [
          [
            [1, 3],
            [2, 6],
            [8, 10],
            [15, 18],
          ],
        ],
        expected: [
          [1, 6],
          [8, 10],
          [15, 18],
        ],
      },
      {
        args: [
          [
            [1, 4],
            [4, 5],
          ],
        ],
        expected: [[1, 5]],
      },
      {
        args: [
          [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
        ],
        expected: [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [3, 4],
          ],
        ],
        expected: [[1, 4]],
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [4, 5],
          ],
        ],
        expected: [
          [1, 3],
          [4, 5],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
          ],
        ],
        expected: [
          [1, 2],
          [3, 4],
          [5, 6],
          [7, 8],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
          ],
        ],
        expected: [[1, 5]],
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [4, 5],
            [5, 6],
          ],
        ],
        expected: [
          [1, 3],
          [4, 6],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [3, 4],
            [5, 6],
            [6, 7],
          ],
        ],
        expected: [
          [1, 2],
          [3, 4],
          [5, 7],
        ],
      },
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [3, 4],
            [5, 6],
            [6, 7],
          ],
        ],
        expected: [
          [1, 4],
          [5, 7],
        ],
      },
    ],
  },
  {
    document_id: "2c94605b-9c75-4bb1-bd36-cb16c0083157",
    description:
      "Given a roman numeral, convert it to an integer. Input is guaranteed to be within the range from 1 to 3999.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Roman to Integer",
    starting_code: "def solution(s):\n  return None",
    test_cases: [
      {
        args: ["III"],
        expected: 3,
      },
      {
        args: ["IV"],
        expected: 4,
      },
      {
        args: ["IX"],
        expected: 9,
      },
      {
        args: ["LVIII"],
        expected: 58,
      },
      {
        args: ["MCMXCIV"],
        expected: 1994,
      },
      {
        args: ["I"],
        expected: 1,
      },
      {
        args: ["V"],
        expected: 5,
      },
      {
        args: ["X"],
        expected: 10,
      },
      {
        args: ["L"],
        expected: 50,
      },
      {
        args: ["C"],
        expected: 100,
      },
      {
        args: ["D"],
        expected: 500,
      },
      {
        args: ["M"],
        expected: 1000,
      },
      {
        args: ["MMMCMXCIX"],
        expected: 3999,
      },
    ],
  },
  {
    document_id: "31af5891-f397-4239-a034-97a6580ba952",
    description:
      "The count-and-say sequence is a sequence of digit strings defined by the recursive formula: countAndSay(n) is the way you would 'say' the digit string from countAndSay(n-1), which is then converted into a different digit string.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Count and Say",
    starting_code: "def solution(n):\n    return None",
    test_cases: [
      {
        args: [1],
        expected: "1",
      },
      {
        args: [2],
        expected: "11",
      },
      {
        args: [3],
        expected: "21",
      },
      {
        args: [4],
        expected: "1211",
      },
      {
        args: [5],
        expected: "111221",
      },
      {
        args: [6],
        expected: "312211",
      },
      {
        args: [7],
        expected: "13112221",
      },
      {
        args: [8],
        expected: "1113213211",
      },
      {
        args: [9],
        expected: "31131211131221",
      },
      {
        args: [10],
        expected: "13211311123113112211",
      },
    ],
  },
  {
    document_id: "33e79dae-5193-4c6b-80cf-4e6eec7f2e47",
    description:
      "Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.",
    difficulty: "hard",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Longest Valid Parentheses",
    starting_code: "def solution(s): return None",
    test_cases: [
      {
        args: ["(()"],
        expected: 2,
      },
      {
        args: [")()())"],
        expected: 4,
      },
      {
        args: ["()(()"],
        expected: 2,
      },
      {
        args: ["()()()()"],
        expected: 8,
      },
      {
        args: [""],
        expected: 0,
      },
      {
        args: ["("],
        expected: 0,
      },
      {
        args: [")"],
        expected: 0,
      },
      {
        args: ["()()()()()()()()()()()()()()()()()()()()()()()()()()()()()"],
        expected: 58,
      },
    ],
  },
  {
    document_id: "3d15941b-f142-48d1-be61-d6cde5a253e3",
    description:
      "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Search Insert Position",
    starting_code: "def solution(nums, target):\n  return None",
    test_cases: [
      {
        args: [[1, 3, 5, 6], 5],
        expected: 2,
      },
      {
        args: [[1, 3, 5, 6], 2],
        expected: 1,
      },
      {
        args: [[1, 3, 5, 6], 7],
        expected: 4,
      },
      {
        args: [[1, 3, 5, 6], 0],
        expected: 0,
      },
      {
        args: [[], 5],
        expected: 0,
      },
      {
        args: [[1, 3, 5, 6], 1],
        expected: 0,
      },
      {
        args: [[1, 3, 5, 6], 6],
        expected: 3,
      },
      {
        args: [[1, 3, 5, 6, 7, 8, 9], 4],
        expected: 2,
      },
      {
        args: [[1, 3, 5, 6, 7, 8, 9], 10],
        expected: 7,
      },
      {
        args: [[1, 3, 5, 6, 7, 8, 9], -1],
        expected: 0,
      },
    ],
  },
  {
    document_id: "3fe61370-416c-4fd6-9938-da121ec52b4e",
    description:
      "Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Multiply Strings",
    starting_code: "def solution(num1, num2):\n  return None",
    test_cases: [
      {
        args: ["2", "3"],
        expected: "6",
      },
      {
        args: ["123", "456"],
        expected: "56088",
      },
      {
        args: ["0", "123"],
        expected: "0",
      },
      {
        args: ["999", "1"],
        expected: "999",
      },
      {
        args: ["123456789", "987654321"],
        expected: "121932631137021795",
      },
      {
        args: ["99999999999999999999999999999999999999999999999999", "1"],
        expected: "99999999999999999999999999999999999999999999999999",
      },
      {
        args: ["123456789", "0"],
        expected: "0",
      },
      {
        args: ["0", "0"],
        expected: "0",
      },
    ],
  },
  {
    document_id: "405b89cb-c409-4420-a64b-13bdbe0cf59d",
    description:
      "Given an unsorted array of integers, find the length of longest increasing subsequence.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Longest Increasing Subsequence",
    test_cases: [
      {
        args: [[10, 9, 2, 5, 3, 7, 101, 18]],
        expected: 4,
      },
      {
        args: [[0, 1, 0, 3, 2, 3]],
        expected: 4,
      },
      {
        args: [[7, 7, 7, 7, 7, 7, 7]],
        expected: 1,
      },
      {
        args: [[1, 2, 3, 4, 5]],
        expected: 5,
      },
      {
        args: [[5, 4, 3, 2, 1]],
        expected: 1,
      },
      {
        args: [[]],
        expected: 0,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[1, 1, 1, 1, 1]],
        expected: 1,
      },
      {
        args: [[-1, -2, -3, -4, -5]],
        expected: 1,
      },
      {
        args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
        expected: 10,
      },
    ],
    starting_code: "def solution(nums):\n    return None",
  },
  {
    document_id: "41853ae2-3bdc-4984-89d2-449867e570c5",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Add Two Numbers",
    starting_code: "def solution(l1, l2):\n  return None",
    test_cases: [
      {
        args: [
          [2, 4, 3],
          [5, 6, 4],
        ],
        expected: [7, 0, 8],
      },
      {
        args: [[0], [0]],
        expected: [0],
      },
      {
        args: [
          [9, 9, 9, 9, 9, 9, 9],
          [9, 9, 9, 9],
        ],
        expected: [8, 9, 9, 9, 0, 0, 0, 1],
      },
      {
        args: [
          [1, 2, 3],
          [4, 5, 6],
        ],
        expected: [5, 7, 9],
      },
      {
        args: [[], [1, 2, 3]],
        expected: [1, 2, 3],
      },
      {
        args: [[], []],
        expected: [],
      },
      {
        args: [[1], [9, 9, 9]],
        expected: [0, 0, 0, 1],
      },
      {
        args: [[9, 9, 9], [1]],
        expected: [0, 0, 0, 1],
      },
    ],
  },
  {
    document_id: "41eeddc5-0b45-445a-b301-3e2ee62892e8",
    description:
      "Given a non-empty string s and a dictionary wordDict containing a list of non-empty words, determine if s can be segmented into a space-separated sequence of one or more dictionary words.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Word Break",
    starting_code: "def solution(s, wordDict):\n  return None",
    test_cases: [
      {
        args: ["leetcode", ["leet", "code"]],
        expected: true,
      },
      {
        args: ["applepenapple", ["apple", "pen"]],
        expected: true,
      },
      {
        args: ["catsandog", ["cats", "dog", "sand", "and", "cat"]],
        expected: false,
      },
      {
        args: ["aaaaaaa", ["aaa", "aaaa"]],
        expected: true,
      },
      {
        args: ["aaaaaaa", ["aaa", "aaaaa"]],
        expected: false,
      },
      {
        args: ["aaaaaaa", ["aaa", "aaaaaa"]],
        expected: false,
      },
      {
        args: ["aaaaaaa", ["aaa", "aaaaaaa"]],
        expected: true,
      },
      {
        args: ["aaaaaaa", ["aaa", "aaaaaaa", "aaaa"]],
        expected: true,
      },
      {
        args: ["aaaaaaa", ["aaa", "aaaaaaa", "aaaaa"]],
        expected: true,
      },
      {
        args: ["aaaaaaa", ["aaa", "aaaaaaa", "aaaaaa"]],
        expected: true,
      },
    ],
  },
  {
    document_id: "53477a77-856b-4546-a2ce-6ebcfb64df36",
    description:
      "Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Palindrome Number",
    test_cases: [
      {
        args: [121],
        expected: true,
      },
      {
        args: [-121],
        expected: false,
      },
      {
        args: [10],
        expected: false,
      },
      {
        args: [0],
        expected: true,
      },
      {
        args: [12345678987654321],
        expected: true,
      },
      {
        args: [123456789],
        expected: false,
      },
    ],
    starting_code: "def solution(x): return None",
  },
  {
    document_id: "556f7fa9-6521-4205-8b8a-21e5bd558e3d",
    description:
      "Given a 2D board and a word, find if the word exists in the grid. The word can be constructed from letters of sequentially adjacent cell, where 'adjacent' cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Word Search",
    starting_code: "def solution(board, word): return None",
    test_cases: [
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCCED",
        ],
        expected: true,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "SEE",
        ],
        expected: true,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCB",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCD",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCESEEDAS",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCESEEDAS",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCESEEDAS",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCESEEDAS",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCESEEDAS",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCESEEDAS",
        ],
        expected: false,
      },
    ],
  },
  {
    document_id: "5d70f571-9b20-4375-8666-53c2344a812b",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.",
    difficulty: "hard",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Trapping Rain Water",
    starting_code: "def solution(height):\n    return None",
    test_cases: [
      {
        args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
        expected: 6,
      },
      {
        args: [[4, 2, 0, 3, 2, 5]],
        expected: 9,
      },
      {
        args: [[0, 0, 0, 0, 0]],
        expected: 0,
      },
      {
        args: [[1, 2, 3, 4, 5]],
        expected: 0,
      },
      {
        args: [[5, 4, 3, 2, 1]],
        expected: 0,
      },
      {
        args: [[1, 1, 1, 1, 1]],
        expected: 0,
      },
      {
        args: [[1, 2, 3, 4, 5, 4, 3, 2, 1]],
        expected: 0,
      },
      {
        args: [[1, 0, 1, 0, 1]],
        expected: 1,
      },
      {
        args: [[1, 0, 1, 0, 1, 0, 1]],
        expected: 2,
      },
      {
        args: [[1, 0, 1, 0, 1, 0, 1, 0, 1]],
        expected: 3,
      },
    ],
  },
  {
    document_id: "5ffd83d7-5062-4b32-8542-80a9a9e129e2",
    description: "Given an unsorted integer array, find the smallest missing positive integer.",
    difficulty: "hard",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "First Missing Positive",
    starting_code: "def solution(nums):\n  return None",
    test_cases: [
      {
        args: [[1, 2, 0]],
        expected: 3,
      },
      {
        args: [[3, 4, -1, 1]],
        expected: 2,
      },
      {
        args: [[7, 8, 9, 11, 12]],
        expected: 1,
      },
      {
        args: [[-1, -2, -3]],
        expected: 1,
      },
      {
        args: [[0, 1, 2, 3, 4, 5]],
        expected: 6,
      },
      {
        args: [[-1, 0, 1, 2, 3, 4, 5]],
        expected: 6,
      },
      {
        args: [[-1, -2, -3, 0, 1, 2, 3, 4, 5]],
        expected: 6,
      },
      {
        args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
        expected: 11,
      },
      {
        args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]],
        expected: 21,
      },
      {
        args: [[-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]],
        expected: 1,
      },
    ],
  },
  {
    document_id: "668ad280-ca38-4b96-9b3c-e65d46839239",
    description:
      "Given a sorted array nums, remove the duplicates in-place such that each element appears only once and returns the new length.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Remove Duplicates from Sorted Array",
    test_cases: [
      {
        args: [[1, 1, 2]],
        expected: 2,
      },
      {
        args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]],
        expected: 5,
      },
      {
        args: [[1, 2, 3, 4, 5]],
        expected: 5,
      },
      {
        args: [[1, 1, 1, 1, 1]],
        expected: 1,
      },
      {
        args: [[-1, -1, 0, 0, 1, 1, 1]],
        expected: 3,
      },
      {
        args: [[]],
        expected: 0,
      },
    ],
    starting_code: "def solution(nums): return None",
  },
  {
    document_id: "66bd0b92-3369-44b8-b837-4ec8ea59d62c",
    description:
      "Merge two sorted linked lists and return it as a new sorted list. The new list should be made by splicing together the nodes of the first two lists.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Merge Two Sorted Lists",
    starting_code: "def solution(l1, l2):\n  return None",
    test_cases: [
      {
        args: [
          [1, 2, 4],
          [1, 3, 4],
        ],
        expected: [1, 1, 2, 3, 4, 4],
      },
      {
        args: [[], []],
        expected: [],
      },
      {
        args: [[], [1, 2, 3]],
        expected: [1, 2, 3],
      },
      {
        args: [[1, 2, 3], []],
        expected: [1, 2, 3],
      },
      {
        args: [
          [1, 2, 3],
          [4, 5, 6],
        ],
        expected: [1, 2, 3, 4, 5, 6],
      },
      {
        args: [
          [1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10],
        ],
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        args: [
          [1, 3, 5],
          [2, 4, 6],
        ],
        expected: [1, 2, 3, 4, 5, 6],
      },
      {
        args: [
          [1, 2, 3, 4, 5],
          [1, 2, 3, 4, 5],
        ],
        expected: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
      },
    ],
  },
  {
    document_id: "6946f488-ac21-4190-90f0-db73a433084d",
    description:
      "Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Container With Most Water",
    starting_code: "def solution(height):\n    return None",
    test_cases: [
      {
        args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
        expected: 49,
      },
      {
        args: [[1, 1]],
        expected: 1,
      },
      {
        args: [[4, 3, 2, 1, 4]],
        expected: 16,
      },
      {
        args: [[1, 2, 1]],
        expected: 2,
      },
      {
        args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
        expected: 25,
      },
      {
        args: [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]],
        expected: 25,
      },
      {
        args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]],
        expected: 100,
      },
      {
        args: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
        expected: 19,
      },
      {
        args: [
          [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25,
          ],
        ],
        expected: 144,
      },
      {
        args: [
          [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27, 28, 29, 30,
          ],
        ],
        expected: 225,
      },
    ],
  },
  // ! I think the tests are wrong for this one
  // {
  //   _id: "6bcaa2d7-d58f-49f1-9940-b8b0b3404bdb",
  //   description:
  //     "A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below). The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid. How many possible unique paths are there?",
  //   difficulty: "medium",
  //   insert_date_: "2023-09-17T08:00:57.413Z",
  //   title: "Unique Paths",
  //   starting_code: "def solution(m, n):\n  return None",
  //   test_cases: [
  //     { args: [1, 1], expected: 1 },
  //     { args: [2, 2], expected: 2 },
  //     { args: [3, 3], expected: 6 },
  //     { args: [3, 7], expected: 28 },
  //     { args: [5, 5], expected: 70 },
  //     { args: [0, 0], expected: 0 },
  //     { args: [1, 10], expected: 1 },
  //     { args: [10, 1], expected: 1 },
  //     { args: [10, 10], expected: 48620 },
  //     { args: [20, 20], expected: 137846528820 },
  //   ],
  // },
  {
    document_id: "6c88131a-0c51-4a5f-9498-859387ac52b2",
    description:
      "Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules: Each row must contain the digits 1-9 without repetition. Each column must contain the digits 1-9 without repetition. Each of the 9 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Valid Sudoku",
    starting_code: "def solution(board): return None",
    test_cases: [
      {
        args: [
          [
            ["5", "3", ".", ".", "7", ".", ".", ".", "."],
            ["6", ".", ".", "1", "9", "5", ".", ".", "."],
            [".", "9", "8", ".", ".", ".", ".", "6", "."],
            ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
            ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
            ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
            [".", "6", ".", ".", ".", ".", "2", "8", "."],
            [".", ".", ".", "4", "1", "9", ".", ".", "5"],
            [".", ".", ".", ".", "8", ".", ".", "7", "9"],
          ],
        ],
        expected: true,
      },
      {
        args: [
          [
            ["8", "3", ".", ".", "7", ".", ".", ".", "."],
            ["6", ".", ".", "1", "9", "5", ".", ".", "."],
            [".", "9", "8", ".", ".", ".", ".", "6", "."],
            ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
            ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
            ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
            [".", "6", ".", ".", ".", ".", "2", "8", "."],
            [".", ".", ".", "4", "1", "9", ".", ".", "5"],
            [".", ".", ".", ".", "8", ".", ".", "7", "9"],
          ],
        ],
        expected: false,
      },
      {
        args: [
          [
            ["5", "3", ".", ".", "7", ".", ".", ".", "."],
            ["6", ".", ".", "1", "9", "5", ".", ".", "."],
            [".", "9", "8", ".", ".", ".", ".", "6", "."],
            ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
            ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
            ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
            [".", "6", ".", ".", ".", ".", "2", "8", "."],
            [".", ".", ".", "4", "1", "9", ".", ".", "5"],
            [".", ".", ".", ".", "8", ".", ".", "7", "8"],
          ],
        ],
        expected: false,
      },
      {
        args: [
          [
            ["5", "3", ".", ".", "7", ".", ".", ".", "."],
            ["6", ".", ".", "1", "9", "5", ".", ".", "."],
            [".", "9", "8", ".", ".", ".", ".", "6", "."],
            ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
            ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
            ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
            [".", "6", ".", ".", ".", ".", "2", "8", "."],
            [".", ".", ".", "4", "1", "9", ".", ".", "5"],
            [".", ".", ".", ".", "8", ".", ".", "7", "9"],
          ],
        ],
        expected: false,
      },
      {
        args: [
          [
            ["5", "3", ".", ".", "7", ".", ".", ".", "."],
            ["6", ".", ".", "1", "9", "5", ".", ".", "."],
            [".", "9", "8", ".", ".", ".", ".", "6", "."],
            ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
            ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
            ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
            [".", "6", ".", ".", ".", ".", "2", "8", "."],
            [".", ".", ".", "4", "1", "9", ".", ".", "5"],
            [".", ".", ".", ".", "8", ".", ".", "7", "9"],
          ],
        ],
        expected: true,
      },
    ],
  },
  {
    document_id: "777dd53e-50a9-4b57-88e0-840e5e925620",
    description:
      "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right which minimizes the sum of all numbers along its path.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Minimum Path Sum",
    starting_code: "def solution(grid):\n  return None",
    test_cases: [
      {
        args: [
          [
            [1, 3, 1],
            [1, 5, 1],
            [4, 2, 1],
          ],
        ],
        expected: 7,
      },
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        ],
        expected: 21,
      },
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12],
          ],
        ],
        expected: 38,
      },
      {
        args: [
          [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
          ],
        ],
        expected: 30,
      },
      {
        args: [
          [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
          ],
        ],
        expected: 36,
      },
      {
        args: [
          [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
        ],
        expected: 5,
      },
      {
        args: [
          [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          ],
        ],
        expected: 55,
      },
      { args: [[[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]], expected: 55 },
    ],
  },
  {
    document_id: "78a59ac6-cd0f-4ef2-8d30-804920811f81",
    description:
      "You are climbing a stair case. It takes n steps to reach to the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Climbing Stairs",
    starting_code: "def solution(n):\n  return None",
    test_cases: [
      { args: [1], expected: 1 },
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [4], expected: 5 },
      { args: [5], expected: 8 },
      { args: [6], expected: 13 },
      { args: [7], expected: 21 },
      { args: [8], expected: 34 },
      { args: [9], expected: 55 },
      { args: [10], expected: 89 },
    ],
  },
  {
    document_id: "7f9c98bb-dee9-483f-8e27-bc089a7ddf93",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Maximum Subarray",
    starting_code: "def solution(nums):\n  return None",
    test_cases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[-1]], expected: -1 },
      { args: [[-2, -1]], expected: -1 },
      { args: [[-2, 1]], expected: 1 },
      { args: [[-2, -1, 2, 3, -1, 2, 1]], expected: 7 },
    ],
  },
  {
    document_id: "86f8603d-0336-47d7-a173-9d88b4b557bb",
    description:
      "Compute and return the square root of x, where x is guaranteed to be a non-negative integer.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Sqrt(x)",
    starting_code: "def solution(x):\n    return None",
    test_cases: [
      { args: [0], expected: 0 },
      { args: [1], expected: 1 },
      { args: [4], expected: 2 },
      { args: [9], expected: 3 },
      { args: [16], expected: 4 },
      { args: [25], expected: 5 },
      { args: [100], expected: 10 },
      { args: [10000], expected: 100 },
      { args: [123456789], expected: 11111 },
      { args: [999999999], expected: 31622 },
    ],
  },
  {
    document_id: "99138e19-6d20-4747-a835-dec15d9214ee",
    description:
      "Given a string s consists of upper/lower-case alphabets and empty space characters ' ', return the length of last word in the string.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Length of Last Word",
    starting_code: "def solution(s):\n  return None",
    test_cases: [
      { args: ["Hello World"], expected: 5 },
      { args: ["   fly me   to   the moon  "], expected: 4 },
      { args: ["Hello"], expected: 5 },
      { args: ["   "], expected: 0 },
      { args: [""], expected: 0 },
      { args: ["a"], expected: 1 },
      { args: ["a b c d e"], expected: 1 },
    ],
  },
  {
    document_id: "9a5e0b38-4694-40ee-81ff-b7dd5353a811",
    description:
      "Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Next Permutation",
    starting_code: "def solution(nums):\n  return None",
    test_cases: [
      { args: [[1, 2, 3]], expected: [1, 3, 2] },
      { args: [[3, 2, 1]], expected: [1, 2, 3] },
      { args: [[1, 1, 5]], expected: [1, 5, 1] },
      { args: [[1, 3, 2]], expected: [2, 1, 3] },
      { args: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 5, 4] },
      { args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
      { args: [[1]], expected: [1] },
      { args: [[1, 1]], expected: [1, 1] },
    ],
  },
  // {
  //   _id: "9b9e2fbd-faf2-4f17-8f09-04bc5cdf464c",
  //   description: "Given a collection of distinct integers, return all possible permutations.",
  //   difficulty: "medium",
  //   insert_date_: "2023-09-17T08:00:57.413Z",
  //   title: "Permutations",
  // },
  {
    document_id: "9ca25824-ae98-4153-a653-7e078b327473",
    description:
      "Given an input string (s) and a pattern (p), implement regular expression matching with support for '.' and '*'.",
    difficulty: "hard",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Regular Expression Matching",
    starting_code: "def solution(s, p):\n  return None",
    test_cases: [
      { args: ["aa", "a"], expected: false },
      { args: ["aa", "a*"], expected: true },
      { args: ["ab", ".*"], expected: true },
      { args: ["aab", "c*a*b"], expected: true },
      { args: ["mississippi", "mis*is*p*."], expected: false },
      { args: ["", "a*"], expected: true },
      { args: ["", ".*"], expected: true },
      { args: ["a", ""], expected: false },
      { args: ["a", "a"], expected: true },
      { args: ["a", "b"], expected: false },
    ],
  },
  {
    document_id: "9daba924-e660-4222-9e0a-3ae817154ac2",
    description:
      "Given a 2D board and a word, find if the word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where 'adjacent' cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Word Search",
    starting_code: "def solution(board, word): return None",
    test_cases: [
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCCED",
        ],
        expected: true,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "SEE",
        ],
        expected: true,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCB",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCD",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCE",
        ],
        expected: true,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCF",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCG",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCH",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCI",
        ],
        expected: false,
      },
      {
        args: [
          [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"],
          ],
          "ABCK",
        ],
        expected: false,
      },
    ],
  },
  {
    document_id: "9e926e00-f760-431e-a30d-1f193bba441d",
    description:
      "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Longest Common Prefix",
    starting_code: "def solution(strs):\n    return None",
    test_cases: [
      { args: [["flower", "flow", "flight"]], expected: "fl" },
      { args: [["dog", "racecar", "car"]], expected: "" },
      { args: [["apple", "ape", "april"]], expected: "ap" },
      { args: [["hello", "hell", "heaven"]], expected: "he" },
      { args: [["coding", "coder", "code"]], expected: "cod" },
      { args: [["abc", "abcd", "abcde"]], expected: "abc" },
      { args: [["abc", "def", "ghi"]], expected: "" },
      { args: [["abc", "abc", "abc"]], expected: "abc" },
      { args: [["abc", "ab", "a"]], expected: "a" },
      { args: [["abc", "ab", "abcde"]], expected: "ab" },
    ],
  },
  // ! tests are straight up wrong
  // {
  //   _id: "a2068579-e0ad-4b24-9d2c-fb7d51b88531",
  //   description:
  //     "You are given a string s and an array of strings words of the same length. Return all starting indices of substring(s) in s that is a concatenation of each word in words exactly once, in any order, and without any intervening characters.",
  //   difficulty: "hard",
  //   insert_date_: "2023-09-17T08:00:57.413Z",
  //   title: "Substring with Concatenation of All Words",
  //   starting_code: "def solution(s, words):\n  return None",
  //   test_cases: [
  //     { args: ["barfoothefoobarman", ["foo", "bar"]], expected: [0, 9] },
  //     { args: ["wordgoodgoodgoodbestword", ["word", "good", "best", "word"]], expected: [] },
  //     { args: ["wordgoodgoodgoodbestword", ["word", "good", "best", "good"]], expected: [8] },
  //     { args: ["foobarfoobar", ["foo", "bar"]], expected: [0, 3, 6] },
  //     { args: ["", ["foo", "bar"]], expected: [] },
  //     { args: ["foobar", []], expected: [] },
  //     { args: ["foobar", ["foo", "bar"]], expected: [0] },
  //     { args: ["foobar", ["bar", "foo"]], expected: [0] },
  //     { args: ["foobar", ["baz"]], expected: [] },
  //     { args: ["foobar", ["foobar"]], expected: [0] },
  //   ],
  // },
  // {
  //   _id: "a3221bcd-b8a0-45f5-9af2-bc760780a43f",
  //   description:
  //     "Find the contiguous subarray within an array (containing at least one number) which has the largest sum.",
  //   difficulty: "easy",
  //   insert_date_: "2023-09-17T08:00:57.413Z",
  //   title: "Maximum Subarray",
  // },
  // {
  //   _id: "a6f2e9d1-e85c-4ee6-9cb5-b8761d67d55a",
  //   description:
  //     "A message containing letters from A-Z is being encoded to numbers using the following mapping: 'A' -> 1, 'B' -> 2, ..., 'Z' -> 26. Given a non-empty string containing only digits, determine the total number of ways to decode it.",
  //   difficulty: "medium",
  //   insert_date_: "2023-09-17T08:00:57.413Z",
  //   title: "Decode Ways",
  // },
  {
    document_id: "a6fdb250-589e-4a81-be1f-e9062369d3e5",
    description: "Given an array of strings, group anagrams together.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Group Anagrams",
    starting_code: "def solution(strs):\n  return None",
    test_cases: [
      {
        args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
      },
      { args: [["a", "b", "c", "d"]], expected: [["a"], ["b"], ["c"], ["d"]] },
      {
        args: [["abc", "cba", "bac", "def", "fed"]],
        expected: [
          ["abc", "cba", "bac"],
          ["def", "fed"],
        ],
      },
      {
        args: [["abcd", "dcba", "abcd", "abcd", "dcba"]],
        expected: [["abcd", "dcba"], ["abcd", "dcba"], ["abcd"]],
      },
      {
        args: [["abc", "def", "ghi", "jkl", "mno", "pqr", "stu", "vwx", "yz"]],
        expected: [["abc"], ["def"], ["ghi"], ["jkl"], ["mno"], ["pqr"], ["stu"], ["vwx"], ["yz"]],
      },
      {
        args: [["abc", "cba", "bac", "def", "fed", "cba", "bac"]],
        expected: [
          ["abc", "cba", "bac"],
          ["def", "fed"],
          ["cba", "bac"],
        ],
      },
      {
        args: [["abc", "def", "ghi", "jkl", "mno", "pqr", "stu", "vwx", "yz", "cba", "bac"]],
        expected: [
          ["abc"],
          ["def"],
          ["ghi"],
          ["jkl"],
          ["mno"],
          ["pqr"],
          ["stu"],
          ["vwx"],
          ["yz"],
          ["cba", "bac"],
        ],
      },
      {
        args: [
          [
            "abc",
            "def",
            "ghi",
            "jkl",
            "mno",
            "pqr",
            "stu",
            "vwx",
            "yz",
            "cba",
            "bac",
            "def",
            "fed",
          ],
        ],
        expected: [
          ["abc"],
          ["def"],
          ["ghi"],
          ["jkl"],
          ["mno"],
          ["pqr"],
          ["stu"],
          ["vwx"],
          ["yz"],
          ["cba", "bac"],
          ["def", "fed"],
        ],
      },
      {
        args: [
          [
            "abc",
            "def",
            "ghi",
            "jkl",
            "mno",
            "pqr",
            "stu",
            "vwx",
            "yz",
            "cba",
            "bac",
            "def",
            "fed",
            "cba",
            "bac",
          ],
        ],
        expected: [
          ["abc"],
          ["def"],
          ["ghi"],
          ["jkl"],
          ["mno"],
          ["pqr"],
          ["stu"],
          ["vwx"],
          ["yz"],
          ["cba", "bac"],
          ["def", "fed"],
          ["cba", "bac"],
        ],
      },
      {
        args: [
          [
            "abc",
            "def",
            "ghi",
            "jkl",
            "mno",
            "pqr",
            "stu",
            "vwx",
            "yz",
            "cba",
            "bac",
            "def",
            "fed",
            "cba",
            "bac",
            "abc",
            "def",
            "ghi",
            "jkl",
            "mno",
            "pqr",
            "stu",
            "vwx",
            "yz",
            "cba",
            "bac",
            "def",
            "fed",
            "cba",
            "bac",
          ],
        ],
        expected: [
          ["abc"],
          ["def"],
          ["ghi"],
          ["jkl"],
          ["mno"],
          ["pqr"],
          ["stu"],
          ["vwx"],
          ["yz"],
          ["cba", "bac"],
          ["def", "fed"],
          ["cba", "bac"],
          ["abc"],
          ["def"],
          ["ghi"],
          ["jkl"],
          ["mno"],
          ["pqr"],
          ["stu"],
          ["vwx"],
          ["yz"],
          ["cba", "bac"],
          ["def", "fed"],
          ["cba", "bac"],
        ],
      },
    ],
  },
  {
    document_id: "a8ea286f-bfe3-4f9c-a863-51bb999ae7cb",
    description:
      "Given a non-empty array of digits representing a non-negative integer, increment one to the integer.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Plus One",
    test_cases: [
      { args: [[1, 2, 3]], expected: [1, 2, 4] },
      { args: [[4, 3, 2, 1]], expected: [4, 3, 2, 2] },
      { args: [[9]], expected: [1, 0] },
      { args: [[9, 9, 9]], expected: [1, 0, 0, 0] },
      { args: [[0]], expected: [1] },
    ],
    starting_code: "def solution(digits): return None",
  },
  {
    document_id: "b220993b-a596-4925-97e5-1d7e5a51ec90",
    description:
      "Given an array of non-negative integers, you are initially positioned at the first index of the array. Each element in the array represents your maximum jump length at that position. Determine if you are able to reach the last index.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Jump Game",
    starting_code: "def solution(nums):\n  return None",
    test_cases: [
      { args: [[2, 3, 1, 1, 4]], expected: true },
      { args: [[3, 2, 1, 0, 4]], expected: false },
      { args: [[0]], expected: true },
      { args: [[1, 0, 1, 0, 1]], expected: false },
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], expected: true },
      { args: [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]], expected: false },
      { args: [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]], expected: true },
      { args: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], expected: false },
    ],
  },
  {
    document_id: "b84366a2-0156-4491-b604-f0e7f4dfad25",
    description: "Given two binary strings, return their sum (also a binary string).",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Add Binary",
    starting_code: "def solution(a, b):\n  return None",
    test_cases: [
      { args: ["11", "1"], expected: "100" },
      { args: ["1010", "1011"], expected: "10101" },
      { args: ["0", "0"], expected: "0" },
      { args: ["1111", "1111"], expected: "11110" },
      { args: ["101010", "101010"], expected: "1010100" },
      { args: ["111111", "1"], expected: "1000000" },
      { args: ["100", "11"], expected: "111" },
      { args: ["110", "10"], expected: "1000" },
      { args: ["101", "101"], expected: "1010" },
      { args: ["1001", "101"], expected: "1110" },
    ],
  },
  {
    document_id: "bcb8aa51-ce47-47de-ba9b-8b64e12efa65",
    description:
      "Given two sorted integer arrays nums1 and nums2, merge nums2 into nums1 as one sorted array.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Merge Sorted Array",
    starting_code: "def solution(nums1, nums2):\n  return None",
    test_cases: [
      { args: [[1, 2, 3, 0, 0, 0], [2, 5, 6], 3, 3], expected: [1, 2, 2, 3, 5, 6] },
      { args: [[1, 2, 3, 0, 0, 0], [4, 5, 6], 3, 3], expected: [1, 2, 3, 4, 5, 6] },
      { args: [[1, 2, 3, 0, 0, 0], [1, 2, 3], 3, 3], expected: [1, 1, 2, 2, 3, 3] },
      { args: [[1, 2, 3, 0, 0, 0], [], 3, 0], expected: [1, 2, 3, 0, 0, 0] },
      { args: [[], [1, 2, 3], 0, 3], expected: [1, 2, 3] },
      { args: [[], [], 0, 0], expected: [] },
      { args: [[1, 1, 1, 1, 1], [2, 2, 2, 2, 2], 5, 5], expected: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2] },
      {
        args: [[-1, -1, -1, -1, -1], [-2, -2, -2, -2, -2], 5, 5],
        expected: [-2, -2, -2, -2, -2, -1, -1, -1, -1, -1],
      },
    ],
  },
  {
    document_id: "bd262d08-a1bb-4984-ae88-9ff363dcd17e",
    description:
      "Given a set of distinct integers, nums, return all possible subsets (the power set).",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Subsets",
    starting_code: "def solution(nums): return None",
    test_cases: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
      { args: [[4, 5, 6]], expected: [[], [4], [5], [6], [4, 5], [4, 6], [5, 6], [4, 5, 6]] },
      { args: [[1]], expected: [[], [1]] },
      {
        args: [[1, 2, 3, 4]],
        expected: [
          [],
          [1],
          [2],
          [3],
          [4],
          [1, 2],
          [1, 3],
          [1, 4],
          [2, 3],
          [2, 4],
          [3, 4],
          [1, 2, 3],
          [1, 2, 4],
          [1, 3, 4],
          [2, 3, 4],
          [1, 2, 3, 4],
        ],
      },
      { args: [[]], expected: [[]] },
      {
        args: [[-1, -2, -3]],
        expected: [[], [-1], [-2], [-3], [-1, -2], [-1, -3], [-2, -3], [-1, -2, -3]],
      },
      {
        args: [[0, 1, 2, 3, 4, 5]],
        expected: [
          [],
          [0],
          [1],
          [2],
          [3],
          [4],
          [5],
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [0, 5],
          [1, 2],
          [1, 3],
          [1, 4],
          [1, 5],
          [2, 3],
          [2, 4],
          [2, 5],
          [3, 4],
          [3, 5],
          [4, 5],
          [0, 1, 2],
          [0, 1, 3],
          [0, 1, 4],
          [0, 1, 5],
          [0, 2, 3],
          [0, 2, 4],
          [0, 2, 5],
          [0, 3, 4],
          [0, 3, 5],
          [0, 4, 5],
          [1, 2, 3],
          [1, 2, 4],
          [1, 2, 5],
          [1, 3, 4],
          [1, 3, 5],
          [1, 4, 5],
          [2, 3, 4],
          [2, 3, 5],
          [2, 4, 5],
          [3, 4, 5],
          [0, 1, 2, 3],
          [0, 1, 2, 4],
          [0, 1, 2, 5],
          [0, 1, 3, 4],
          [0, 1, 3, 5],
          [0, 1, 4, 5],
          [0, 2, 3, 4],
          [0, 2, 3, 5],
          [0, 2, 4, 5],
          [0, 3, 4, 5],
          [1, 2, 3, 4],
          [1, 2, 3, 5],
          [1, 2, 4, 5],
          [1, 3, 4, 5],
          [2, 3, 4, 5],
          [0, 1, 2, 3, 4],
          [0, 1, 2, 3, 5],
          [0, 1, 2, 4, 5],
          [0, 1, 3, 4, 5],
          [0, 2, 3, 4, 5],
          [1, 2, 3, 4, 5],
          [0, 1, 2, 3, 4, 5],
        ],
      },
    ],
  },
  {
    document_id: "c002daf8-aa8b-401d-a14a-97178f781712",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Two Sum",
    starting_code: "def solution(nums, target):\n    return None",
    test_cases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[1, 2, 3, 4, 5], 8], expected: [2, 4] },
      { args: [[], 9], expected: null },
      { args: [[1, 2, 3, 4, 5], 10], expected: null },
      { args: [[1, 1, 1, 1, 1], 2], expected: [0, 1] },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { args: [[0, 0, 0, 0, 0], 0], expected: [0, 1] },
      { args: [[-1, 0, 1, 2, -1, -4], 0], expected: [0, 2] },
    ],
  },
  {
    document_id: "c21c7e86-6a55-4050-bdbe-8f15ed62615a",
    description:
      "Given an unsorted array of integers, find the length of the longest consecutive elements sequence.",
    difficulty: "hard",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Longest Consecutive Sequence",
    test_cases: [
      { args: [[1, 2, 3, 4, 5]], expected: 5 },
      { args: [[5, 4, 3, 2, 1]], expected: 5 },
      { args: [[1, 3, 5, 7, 9]], expected: 1 },
      { args: [[]], expected: 0 },
      { args: [[1]], expected: 1 },
      { args: [[1, 1, 1, 1, 1]], expected: 1 },
      { args: [[-1, -2, -3, -4, -5]], expected: 5 },
      { args: [[-5, -4, -3, -2, -1]], expected: 5 },
      { args: [[-5, -3, -1, 1, 3, 5]], expected: 1 },
    ],
    starting_code: "def solution(nums):\n    return None",
  },
  {
    document_id: "c66ded32-1a04-4acb-b88d-b085bbe4f88b",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Valid Parentheses",
    starting_code: "def solution(s):\n  return None",
    test_cases: [
      { args: ["()"], expected: true },
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false },
      { args: ["([)]"], expected: false },
      { args: ["{[]}"], expected: true },
      { args: [""], expected: true },
      { args: ["("], expected: false },
      { args: [")"], expected: false },
      { args: ["[["], expected: false },
      { args: ["[[]]"], expected: true },
    ],
  },
  {
    document_id: "dd732c71-f25d-416c-a0cc-ee5c1b69a31c",
    description:
      "Say you have an array for which the ith element is the price of a given stock on day i. If you were only permitted to complete at most one transaction (i.e., buy one and sell one share of the stock), design an algorithm to find the maximum profit.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Best Time to Buy and Sell Stock",
    test_cases: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[1, 2, 3, 4, 5]], expected: 4 },
      { args: [[7, 2, 5, 1, 6, 4]], expected: 5 },
      { args: [[3, 2, 6, 5, 0, 3]], expected: 4 },
      { args: [[]], expected: 0 },
      { args: [[1]], expected: 0 },
      { args: [[1, 1, 1, 1, 1]], expected: 0 },
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], expected: 9 },
      { args: [[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]], expected: 0 },
    ],
    starting_code: "def solution(prices):\n    return None",
  },
  {
    document_id: "de78ec99-5cbd-43c2-b882-e937373de5c2",
    description:
      "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    difficulty: "medium",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Generate Parentheses",
    starting_code: "def solution(n):\n    return None",
    test_cases: [
      { args: [0], expected: [] },
      { args: [1], expected: ["()"] },
      { args: [2], expected: ["(())", "()()"] },
      { args: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] },
      {
        args: [4],
        expected: [
          "(((())))",
          "((()()))",
          "((())())",
          "((()))()",
          "(()(()))",
          "(()()())",
          "(()())()",
          "(())(())",
          "(())()()",
          "()((()))",
          "()(()())",
          "()(())()",
          "()()(())",
          "()()()()",
        ],
      },
    ],
  },
  {
    document_id: "e3b74ea4-a709-444e-ad1d-ede05ee59b46",
    description:
      "Merge k sorted linked lists and return it as one sorted list. Analyze and describe its complexity.",
    difficulty: "hard",
    insert_date_: "2023-09-17T08:00:57.413Z",
    title: "Merge k Sorted Lists",
    test_cases: [
      { args: [[]], expected: [] },
      { args: [[[]]], expected: [] },
      {
        args: [
          [
            [1, 4, 5],
            [1, 3, 4],
            [2, 6],
          ],
        ],
        expected: [1, 1, 2, 3, 4, 4, 5, 6],
      },
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        ],
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      {
        args: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12],
            [13, 14, 15],
            [16, 17, 18],
            [19, 20, 21],
            [22, 23, 24],
            [25, 26, 27],
          ],
        ],
        expected: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
          26, 27,
        ],
      },
    ],
    starting_code: "def solution(lists):\n    return None",
  },
  {
    document_id: "f2f95b7e-015e-4b73-b5cf-e67a367dbc79",
    description: "Given a 32-bit signed integer, reverse digits of an integer.",
    difficulty: "easy",
    insert_date_: "2023-09-17T08:00:57.412Z",
    title: "Reverse Integer",
    starting_code: "def solution(x):\n    return None",
    test_cases: [
      { args: [123], expected: 321 },
      { args: [-123], expected: -321 },
      { args: [120], expected: 21 },
      { args: [0], expected: 0 },
      { args: [1534236469], expected: 0 },
      { args: [2147483647], expected: 0 },
      { args: [-2147483648], expected: 0 },
      { args: [10], expected: 1 },
      { args: [1000000003], expected: 3000000001 },
      { args: [-1000000003], expected: -3000000001 },
    ],
  },
]
