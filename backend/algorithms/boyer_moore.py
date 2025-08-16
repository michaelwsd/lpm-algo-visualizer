from .z_algorithm import get_z_array

def reverse_z_array(str):
    z_array, _ = get_z_array(str[::-1])
    return z_array[::-1]

def preprocess_extended_bad_char(pat, amap):
    m = len(pat)
    Rk = []

    last_seen = [0] * len(amap)

    for i in range(m):
        row = [0] * len(amap)

        for letter in amap:
            idx = amap[letter]
            # copy from last seen
            row[idx] = last_seen[idx]

        Rk.append(row)
        # update letter
        last_seen[amap[pat[i]]] = i + 1

    return Rk

def preprocess_good_suffix(pat):
    m = len(pat)
    # length of the longest substring ending at i that matches a suffix of the pattern
    z_suffix = reverse_z_array(pat)

    # rightmost earlier occurrence of pat[p...m]
    gs = [0] * (m + 1)

    for p in range(m - 1): # m-1 as good suffix is empty if mismatch is at the last character
        j = m - z_suffix[p] # get starting index of the matched suffix (1-based)
        
        # strong good suffix
        char_before = p - z_suffix[p]

        if z_suffix[p] > 0 and (char_before < 0 or pat[j-1] != pat[char_before]): 
            gs[j] = p + 1 # p is where the rightmost substring occurred, j is the starting index of the suffix, 1-based

            # debug(p, j, pat, char_before, gs, z_suffix)
        
        # mismatch at the last character, get the right most letter differing from the last letter
        if pat[p] != pat[-1]:
            gs[m] = p + 1
    
    return gs

def preprocess_match_prefix(pat):
    m = len(pat)
    mp = [m] + [0] * m
    z_array, _ = get_z_array(pat)
    longest = 0

    for i in range(m - 1, 0, -1):
        matched_len = z_array[i]

        # only update if the whole suffix matches
        if matched_len == m - i:
            longest = max(longest, z_array[i])

        mp[i] = longest

    return mp

class BoyerMoore:
    def __init__(self, pat):
        self.pat = pat
        self.length = len(pat)

        # count unique letters in pattern
        count = [False] * 256
        self.amap = {}
        idx = 0

        for c in pat:
            key = ord(c)
            if not count[key]:
                count[key] = True 
                self.amap[c] = idx 
                idx += 1

        # pre-processing
        self.extended_bad_char_table = preprocess_extended_bad_char(pat, self.amap)
        self.gs = preprocess_good_suffix(pat)
        self.mp = preprocess_match_prefix(pat)

    def bad_char_rule(self, idx, char): 
        if char not in self.amap:
            return idx + 1
        
        i = self.amap[char] # char:index in Rk
        if self.extended_bad_char_table[idx][i] == 0:
            # skip the whole thing
            return idx + 1
        else:
            return idx - (self.extended_bad_char_table[idx][i] - 1)

    def good_suffix_rule(self, idx):
        shift_gs = self.gs[idx + 1]
        shift_mp = self.mp[idx + 1]
        
        # good suffix is fully matched
        if shift_gs > 0:
            # shift length, start skip index, skip length 
            return self.length - shift_gs, shift_gs - 1, self.length - idx - 1 
        # calculate max safe shift
        else:
            # use matched prefix
            return self.length - shift_mp, shift_mp - 1, shift_mp

    def pattern_match(self, text):
        n, m = len(text), self.length
        skip_start, skip_len = -1, -1 # index to start skipping and length to skip
        i = 0  # start index in text
        res = []

        steps = []
        preprocess = {
            'amap': list(self.amap.keys()),
            'rk': self.extended_bad_char_table,
            'gs': self.gs,
            'mp': self.mp
        }

        # edge case if len(pat) > len(txt)
        if m > n: return res 

        while i <= n - m:
            
            j = m - 1 # last index of pattern

            steps.append({
                'pos': i,
                'pointer': j,
                'type': None
            })

            # right to left pattern matching
            while j >= 0 and self.pat[j] == text[i + j]:
                
                # skip the previously matched region
                if j == skip_start:
                    j -= skip_len
                    
                    steps.append({
                        'pos': i,
                        'pointer': j,
                        'skip': skip_len,
                        'type': 'skip'
                    })

                    skip_start, skip_len = -1, -1
                    continue

                steps.append({
                    'pos': i,
                    'pointer': j,
                    'match': True,
                    'comparison': (j, i+j),
                    'type': 'compare'
                })

                j -= 1

            if j >= 0:
                steps.append({
                    'pos': i,
                    'pointer': j,
                    'match': False,
                    'comparison': (j, i+j),
                    'type': 'compare'
                })

            # we have a full match
            if j < 0:
                res.append(i)
                
                # maximum safe shift based on largest matched prefix
                shift = m - self.mp[1] 

                steps.append({
                    'pos': i,
                    'pointer': j,
                    'type': 'match',
                    'shift_len': shift,
                    'res': res[:]
                })

            # calculate max safe shift
            else:
                bc_shift = self.bad_char_rule(j, text[i + j])
                gs_shift, shift_idx, shift_len = self.good_suffix_rule(j)
                shift = max(bc_shift, gs_shift)

                steps.append({
                    'pos': i,
                    'pointer': j,
                    'bc': bc_shift,
                    'gs': gs_shift,
                    'shift_len': shift,
                    'type': 'shift'
                })

                # get the region to skip next iteration
                if gs_shift > bc_shift:
                    skip_start, skip_len = shift_idx, shift_len
                else:
                    skip_start, skip_len = -1, -1

            i += shift

        steps.append({
            'type': 'finished'
        })
        
        return {
            'preprocess': preprocess,
            'steps': steps
        }

def display_output(pat, txt):
    boyerMoore = BoyerMoore(pat)

    print(f"text: {txt}")
    print(f'pattern: {pat}')
    
    print()
    Rk = boyerMoore.extended_bad_char_table
    print(f"Rk:{list(boyerMoore.amap.keys())}")
    for i, row in enumerate(Rk):
        print(f"{i+1}: {row}")

    print()
    print(f'gs: {boyerMoore.gs}')
    
    print()
    print(f'mp: {boyerMoore.mp}')
    
    print()
    print(f'result: {boyerMoore.pattern_match(txt)}')
    print('--------------------------------------------------')

if __name__ == "__main__":
    # # lecture example
    # display_output('abca', 'aaxbcabcaaxabcabc')

    # # good suffix skip test
    # display_output('baaccac', 'baacbacbaaccac')

    # # correct shift after full match
    # display_output('abcabb', 'abcabbabc')

    boyerMoore = BoyerMoore('baaccac')
    res = boyerMoore.pattern_match('baacbacbaaccac')
    for i, c in res['preprocess'].items():
        print(f'{i}: {c}')

    print(f'res: {res['res']}')

    for i in res['steps']:
        print(i)