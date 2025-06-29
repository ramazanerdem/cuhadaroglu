"""
Kth Largest Element in Array - Python Implementation
"""

import random
import time
import heapq
import json

def find_kth_largest(nums, k):
    return sorted(nums, reverse=True)[k - 1]

def find_kth_largest_heap(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

def find_kth_largest_merge_sort(nums, k):
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        return merge(left, right)
    
    def merge(left, right):
        result = []
        left_idx = right_idx = 0
        while left_idx < len(left) and right_idx < len(right):
            if left[left_idx] >= right[right_idx]:
                result.append(left[left_idx])
                left_idx += 1
            else:
                result.append(right[right_idx])
                right_idx += 1
        result.extend(left[left_idx:])
        result.extend(right[right_idx:])
        return result
    
    sorted_nums = merge_sort(nums.copy())
    return sorted_nums[k - 1]

def find_kth_largest_quicksort(nums, k):
    """Quicksort algorithm - O(n log n) average, O(n²) worst case"""
    def quicksort(arr, left=0, right=None):
        if right is None:
            right = len(arr) - 1
        
        if left < right:
            pivot_index = partition(arr, left, right)
            quicksort(arr, left, pivot_index - 1)
            quicksort(arr, pivot_index + 1, right)
        return arr
    
    def partition(arr, left, right):
        # Random pivot selection
        random_index = random.randint(left, right)
        arr[random_index], arr[right] = arr[right], arr[random_index]
        
        pivot = arr[right]
        i = left
        for j in range(left, right):
            if arr[j] >= pivot:  # Descending order for k-th largest
                arr[i], arr[j] = arr[j], arr[i]
                i += 1
        arr[i], arr[right] = arr[right], arr[i]
        return i
    
    sorted_array = quicksort(nums.copy())
    return sorted_array[k - 1]

def find_kth_largest_quickselect(nums, k):
    target_index = len(nums) - k
    
    def quickselect(left, right):
        if left == right:
            return nums[left]
        
        random_index = random.randint(left, right)
        nums[random_index], nums[right] = nums[right], nums[random_index]
        pivot_index = partition(left, right)
        
        if pivot_index == target_index:
            return nums[pivot_index]
        elif pivot_index < target_index:
            return quickselect(pivot_index + 1, right)
        else:
            return quickselect(left, pivot_index - 1)
    
    def partition(left, right):
        pivot = nums[right]
        i = left
        for j in range(left, right):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[right] = nums[right], nums[i]
        return i
    
    return quickselect(0, len(nums) - 1)

def run_tests():
    test_cases = [
        {"nums": [3, 2, 1, 5, 6, 4], "k": 2, "expected": 5},
        {"nums": [3, 2, 3, 1, 2, 4, 5, 5, 6], "k": 4, "expected": 4},
        {"nums": [1], "k": 1, "expected": 1},
        {"nums": [7, 10, 4, 3, 20, 15], "k": 3, "expected": 10},
    ]
    
    print("Test Sonuçları (Python):")
    print("=" * 50)
    
    for i, test in enumerate(test_cases, 1):
        result1 = find_kth_largest(test["nums"].copy(), test["k"])
        result2 = find_kth_largest_heap(test["nums"].copy(), test["k"])
        result3 = find_kth_largest_merge_sort(test["nums"].copy(), test["k"])
        result4 = find_kth_largest_quicksort(test["nums"].copy(), test["k"])
        result5 = find_kth_largest_quickselect(test["nums"].copy(), test["k"])
        
        print(f"Test {i}:")
        print(f"  Input: {test['nums']}, k={test['k']}")
        print(f"  Expected: {test['expected']}")
        print(f"  Built-in Sort: {result1} {'✓' if result1 == test['expected'] else '✗'}")
        print(f"  Heap: {result2} {'✓' if result2 == test['expected'] else '✗'}")
        print(f"  Merge Sort: {result3} {'✓' if result3 == test['expected'] else '✗'}")
        print(f"  Quicksort: {result4} {'✓' if result4 == test['expected'] else '✗'}")
        print(f"  Quickselect: {result5} {'✓' if result5 == test['expected'] else '✗'}")
        print()

def performance_test():
    print("🎯 Python Performance Analizi")
    print("=" * 70)
    
    sizes = [100, 1000, 10000, 100000]
    iterations = 20
    results = []
    
    for size in sizes:
        print(f"\n📊 Dizi boyutu: {size}")
        print("=" * 50)
        
        k_positions = [
            {"name": "1. en büyük", "k": 1},
            {"name": "Ortadaki", "k": max(1, size // 2)},
            {"name": "Son (en küçük)", "k": size}
        ]
        
        for pos in k_positions:
            name, k = pos["name"], pos["k"]
            print(f"\n{name} (k={k}, %{k/size*100:.1f})")
            print("-" * 40)
            
            builtin_total = heap_total = merge_total = quicksort_total = quickselect_total = 0
            
            for _ in range(iterations):
                nums = [random.randint(1, size) for _ in range(size)]
                
                start = time.perf_counter()
                find_kth_largest(nums.copy(), k)
                builtin_total += (time.perf_counter() - start) * 1000
                
                start = time.perf_counter()
                find_kth_largest_heap(nums.copy(), k)
                heap_total += (time.perf_counter() - start) * 1000
                
                start = time.perf_counter()
                find_kth_largest_merge_sort(nums.copy(), k)
                merge_total += (time.perf_counter() - start) * 1000
                
                start = time.perf_counter()
                find_kth_largest_quicksort(nums.copy(), k)
                quicksort_total += (time.perf_counter() - start) * 1000
                
                start = time.perf_counter()
                find_kth_largest_quickselect(nums.copy(), k)
                quickselect_total += (time.perf_counter() - start) * 1000
            
            avg_builtin = builtin_total / iterations
            avg_heap = heap_total / iterations
            avg_merge = merge_total / iterations
            avg_quicksort = quicksort_total / iterations
            avg_quickselect = quickselect_total / iterations
            
            times = [
                {"name": "Built-in Sort", "time": avg_builtin},
                {"name": "Heap", "time": avg_heap},
                {"name": "Merge Sort", "time": avg_merge},
                {"name": "Quicksort", "time": avg_quicksort},
                {"name": "Quickselect", "time": avg_quickselect}
            ]
            fastest = min(times, key=lambda x: x["time"])
            
            print(f"Built-in Sort:  {avg_builtin:.3f}ms")
            print(f"Heap:           {avg_heap:.3f}ms")
            print(f"Merge Sort:     {avg_merge:.3f}ms")
            print(f"Quicksort:      {avg_quicksort:.3f}ms")
            print(f"Quickselect:    {avg_quickselect:.3f}ms")
            print(f"🏆 Kazanan:     {fastest['name']}")
            
            results.append({
                "language": "Python",
                "size": size,
                "position": name,
                "k": k,
                "builtinSort": round(avg_builtin, 3),
                "heap": round(avg_heap, 3),
                "mergeSort": round(avg_merge, 3),
                "quicksort": round(avg_quicksort, 3),
                "quickselect": round(avg_quickselect, 3),
                "fastest": fastest["name"]
            })
    
    # JSON dosyasına yaz
    with open('python_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("\n\n📋 JSON SONUÇLAR python_results.json dosyasına yazıldı.")
    print(json.dumps(results, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    run_tests()
    performance_test() 