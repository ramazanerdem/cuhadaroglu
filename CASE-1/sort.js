/**
 * Kth Largest Element in Array - Farklı Yaklaşımlar
 */

// Yaklaşım 1: Built-in Sort (En Pratik)
function findKthLargest(nums, k) {
  // JavaScript'in built-in sort metodu TimSort kullanır
  // O(n log n) zaman karmaşıklığı, O(1) ek alan
  return nums.sort((a, b) => b - a)[k - 1]
}

// Yaklaşım 2: Min Heap (Size k)
function findKthLargestHeap(nums, k) {
  // Min heap kullanarak O(n log k) zaman karmaşıklığı
  class MinHeap {
    constructor() {
      this.heap = []
    }

    size() {
      return this.heap.length
    }

    peek() {
      return this.heap[0]
    }

    push(val) {
      this.heap.push(val)
      this.heapifyUp()
    }

    pop() {
      if (this.heap.length === 0) return null
      if (this.heap.length === 1) return this.heap.pop()

      const top = this.heap[0]
      this.heap[0] = this.heap.pop()
      this.heapifyDown()
      return top
    }

    heapifyUp() {
      let idx = this.heap.length - 1
      while (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2)
        if (this.heap[parentIdx] <= this.heap[idx]) break
        ;[this.heap[parentIdx], this.heap[idx]] = [
          this.heap[idx],
          this.heap[parentIdx],
        ]
        idx = parentIdx
      }
    }

    heapifyDown() {
      let idx = 0
      while (2 * idx + 1 < this.heap.length) {
        const leftChild = 2 * idx + 1
        const rightChild = 2 * idx + 2
        let smallestIdx = leftChild

        if (
          rightChild < this.heap.length &&
          this.heap[rightChild] < this.heap[leftChild]
        ) {
          smallestIdx = rightChild
        }

        if (this.heap[idx] <= this.heap[smallestIdx]) break
        ;[this.heap[idx], this.heap[smallestIdx]] = [
          this.heap[smallestIdx],
          this.heap[idx],
        ]
        idx = smallestIdx
      }
    }
  }

  const heap = new MinHeap()

  for (const num of nums) {
    heap.push(num)
    if (heap.size() > k) {
      heap.pop()
    }
  }

  return heap.peek()
}

// Yaklaşım 3: Merge Sort
function findKthLargestMergeSort(nums, k) {
  // Merge Sort algoritması - O(n log n) zaman, O(n) alan karmaşıklığı
  function mergeSort(arr) {
    if (arr.length <= 1) return arr

    const mid = Math.floor(arr.length / 2)
    const left = mergeSort(arr.slice(0, mid))
    const right = mergeSort(arr.slice(mid))

    return merge(left, right)
  }

  function merge(left, right) {
    const result = []
    let leftIndex = 0
    let rightIndex = 0

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] >= right[rightIndex]) {
        result.push(left[leftIndex])
        leftIndex++
      } else {
        result.push(right[rightIndex])
        rightIndex++
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
  }

  const sorted = mergeSort([...nums])
  return sorted[k - 1]
}

// Yaklaşım 4: Quicksort (Full Sorting)
function findKthLargestQuicksort(nums, k) {
  // Quicksort algoritması - O(n log n) average, O(n²) worst case
  // Tüm diziyi sıralar, sonra k'ıncı elemanı döner
  function quicksort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
      const pivotIndex = partition(arr, left, right)
      quicksort(arr, left, pivotIndex - 1)
      quicksort(arr, pivotIndex + 1, right)
    }
    return arr
  }

  function partition(arr, left, right) {
    // Rastgele pivot seçimi
    const randomIndex = left + Math.floor(Math.random() * (right - left + 1))
    ;[arr[randomIndex], arr[right]] = [arr[right], arr[randomIndex]]

    const pivot = arr[right]
    let i = left

    for (let j = left; j < right; j++) {
      if (arr[j] >= pivot) {
        // Descending order for k-th largest
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        i++
      }
    }

    ;[arr[i], arr[right]] = [arr[right], arr[i]]
    return i
  }

  const sortedArray = quicksort([...nums])
  return sortedArray[k - 1]
}

// Yaklaşım 5: Quickselect (En Verimli - Teorik)
function findKthLargestQuickselect(nums, k) {
  // Quickselect algoritması - O(n) ortalama, O(n²) worst case
  const targetIndex = nums.length - k // k'ncı en büyük = (n-k)'ncı en küçük

  function quickselect(left, right) {
    if (left === right) return nums[left]

    // Rastgele pivot seçimi worst case'i azaltır
    const randomIndex = left + Math.floor(Math.random() * (right - left + 1))
    ;[nums[randomIndex], nums[right]] = [nums[right], nums[randomIndex]]

    const pivotIndex = partition(left, right)

    if (pivotIndex === targetIndex) {
      return nums[pivotIndex]
    } else if (pivotIndex < targetIndex) {
      return quickselect(pivotIndex + 1, right)
    } else {
      return quickselect(left, pivotIndex - 1)
    }
  }

  function partition(left, right) {
    const pivot = nums[right]
    let i = left

    for (let j = left; j < right; j++) {
      if (nums[j] <= pivot) {
        ;[nums[i], nums[j]] = [nums[j], nums[i]]
        i++
      }
    }

    ;[nums[i], nums[right]] = [nums[right], nums[i]]
    return i
  }

  return quickselect(0, nums.length - 1)
}

// Adaptif çözüm - Dizi boyutuna göre en uygun yöntemi seçer
function findKthLargestAdaptive(nums, k) {
  const n = nums.length

  // Küçük diziler için built-in sort
  if (n <= 100) {
    return findKthLargest([...nums], k)
  }

  // k çok küçükse heap kullan
  if (k <= Math.log2(n)) {
    return findKthLargestHeap([...nums], k)
  }

  // Büyük diziler için quickselect
  return findKthLargestQuickselect([...nums], k)
}

// Test fonksiyonu
function runTests() {
  const testCases = [
    { nums: [3, 2, 1, 5, 6, 4], k: 2, expected: 5 },
    { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4, expected: 4 },
    { nums: [1], k: 1, expected: 1 },
    { nums: [7, 10, 4, 3, 20, 15], k: 3, expected: 10 },
  ]

  console.log('Test Sonuçları:')
  console.log('='.repeat(50))

  testCases.forEach((test, index) => {
    const result1 = findKthLargest([...test.nums], test.k)
    const result2 = findKthLargestHeap([...test.nums], test.k)
    const result3 = findKthLargestMergeSort([...test.nums], test.k)
    const result4 = findKthLargestQuicksort([...test.nums], test.k)
    const result5 = findKthLargestQuickselect([...test.nums], test.k)
    const result6 = findKthLargestAdaptive([...test.nums], test.k)

    console.log(`Test ${index + 1}:`)
    console.log(`  Input: [${test.nums}], k=${test.k}`)
    console.log(`  Expected: ${test.expected}`)
    console.log(
      `  Built-in Sort: ${result1} ${result1 === test.expected ? '✓' : '✗'}`
    )
    console.log(`  Heap: ${result2} ${result2 === test.expected ? '✓' : '✗'}`)
    console.log(
      `  Merge Sort: ${result3} ${result3 === test.expected ? '✓' : '✗'}`
    )
    console.log(
      `  Quicksort: ${result4} ${result4 === test.expected ? '✓' : '✗'}`
    )
    console.log(
      `  Quickselect: ${result5} ${result5 === test.expected ? '✓' : '✗'}`
    )
    console.log(
      `  Adaptive: ${result6} ${result6 === test.expected ? '✓' : '✗'}`
    )
    console.log('')
  })
}

// Performance testi
function performanceTest() {
  console.log('🎯 Kapsamlı Sorting Performance Analizi')
  console.log('='.repeat(70))

  const sizes = [100, 1000, 10000, 100000]
  const iterations = 20
  const results = []

  sizes.forEach((size) => {
    console.log(`\n📊 Dizi boyutu: ${size}`)
    console.log('='.repeat(50))

    // Farklı k pozisyonları: 1., 1/2, son
    const kPositions = [
      { name: '1. en büyük', k: 1 },
      { name: 'Ortadaki', k: Math.max(1, Math.floor(size / 2)) },
      { name: 'Son (en küçük)', k: size },
    ]

    kPositions.forEach(({ name, k }) => {
      console.log(`\n${name} (k=${k}, %${((k / size) * 100).toFixed(1)})`)
      console.log('-'.repeat(40))

      let builtinSortTotal = 0
      let heapTotal = 0
      let mergeSortTotal = 0
      let quicksortTotal = 0
      let quickselectTotal = 0

      for (let i = 0; i < iterations; i++) {
        const nums = Array.from({ length: size }, () =>
          Math.floor(Math.random() * size)
        )

        // Built-in Sort
        const start1 = performance.now()
        findKthLargest([...nums], k)
        const end1 = performance.now()
        builtinSortTotal += end1 - start1

        // Heap
        const start2 = performance.now()
        findKthLargestHeap([...nums], k)
        const end2 = performance.now()
        heapTotal += end2 - start2

        // Merge Sort
        const start3 = performance.now()
        findKthLargestMergeSort([...nums], k)
        const end3 = performance.now()
        mergeSortTotal += end3 - start3

        // Quicksort
        const start4 = performance.now()
        findKthLargestQuicksort([...nums], k)
        const end4 = performance.now()
        quicksortTotal += end4 - start4

        // Quickselect
        const start5 = performance.now()
        findKthLargestQuickselect([...nums], k)
        const end5 = performance.now()
        quickselectTotal += end5 - start5
      }

      const avgBuiltin = (builtinSortTotal / iterations).toFixed(3)
      const avgHeap = (heapTotal / iterations).toFixed(3)
      const avgMergeSort = (mergeSortTotal / iterations).toFixed(3)
      const avgQuicksort = (quicksortTotal / iterations).toFixed(3)
      const avgQuickselect = (quickselectTotal / iterations).toFixed(3)

      // En hızlısını belirle
      const times = [
        { name: 'Built-in Sort', time: parseFloat(avgBuiltin) },
        { name: 'Heap', time: parseFloat(avgHeap) },
        { name: 'Merge Sort', time: parseFloat(avgMergeSort) },
        { name: 'Quicksort', time: parseFloat(avgQuicksort) },
        { name: 'Quickselect', time: parseFloat(avgQuickselect) },
      ]
      const fastest = times.reduce((prev, current) =>
        prev.time < current.time ? prev : current
      )

      console.log(`Built-in Sort:  ${avgBuiltin}ms`)
      console.log(`Heap:           ${avgHeap}ms`)
      console.log(`Merge Sort:     ${avgMergeSort}ms`)
      console.log(`Quicksort:      ${avgQuicksort}ms`)
      console.log(`Quickselect:    ${avgQuickselect}ms`)
      console.log(`🏆 Kazanan:     ${fastest.name}`)

      // Sonuçları kaydet
      results.push({
        size,
        position: name,
        k,
        kRatio: ((k / size) * 100).toFixed(1),
        builtinSort: parseFloat(avgBuiltin),
        heap: parseFloat(avgHeap),
        mergeSort: parseFloat(avgMergeSort),
        quicksort: parseFloat(avgQuicksort),
        quickselect: parseFloat(avgQuickselect),
        fastest: fastest.name,
        improvement:
          Math.max(
            parseFloat(avgBuiltin),
            parseFloat(avgHeap),
            parseFloat(avgMergeSort),
            parseFloat(avgQuicksort)
          ) / parseFloat(avgQuickselect),
      })
    })
  })

  // JSON formatında sonuçları yazdır (rapor için)
  console.log('\n\n📋 JSON SONUÇLAR (Rapor için):')
  console.log('='.repeat(70))
  console.log(JSON.stringify(results, null, 2))
}

// Export etmek için
module.exports = {
  findKthLargest,
  findKthLargestHeap,
  findKthLargestMergeSort,
  findKthLargestQuicksort,
  findKthLargestQuickselect,
  findKthLargestAdaptive,
  runTests,
  performanceTest,
}

// Eğer bu dosya doğrudan çalıştırılıyorsa testleri çalıştır
if (require.main === module) {
  runTests()
  performanceTest()
}
