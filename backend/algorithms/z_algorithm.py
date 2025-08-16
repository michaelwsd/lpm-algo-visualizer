def z_algorithm(text, pattern):
    if len(pattern) > len(text):
        return []
    
    newStr = pattern + "$" + text 
    
    z_array, steps = get_z_array(newStr)

    z_array = z_array[len(pattern)+1:]
    res = [i for i in range(len(z_array)) if z_array[i] == len(pattern)]

    # returns starting index of the matching position
    return {'res': res, 'steps': steps}

def get_z_array(str):
    steps = []
    zArray = [0] * len(str)
    l, r = 0, 0

    steps.append({
        'l': l,
        'r': r,
        'k': 1,
        'z_array': zArray[:]
    })

    for k in range(1, len(str)):

        # if we can't use previous results, we have to manually pattern match from the start
        if k > r:
            # set the box to the current index
            l = r = k 

            steps.append({
                'l': l,
                'r': r,
                'k': k,
                'z_array': zArray[:]
            })
            
            # pattern match from the start and expand box
            while r < len(str) and str[r] == str[r - l]:

                steps.append({
                    'l': l,
                    'r': r,
                    'k': k,
                    'comparison': (r, r-l),
                    'match': True,
                    'z_array': zArray[:]
                })

                r += 1

                steps.append({
                    'l': l,
                    'r': r,
                    'k': k,
                    'z_array': zArray[:]
                })
            
            steps.append({
                    'l': l,
                    'r': r,
                    'k': k,
                    'comparison': (r, r-l),
                    'match': False,
                    'z_array': zArray[:]
                })
            
            # record matched length 
            zArray[k] = r - l

            # update z array
            steps.append({
                'l': l,
                'r': r,
                'k': k,
                'z_array': zArray[:]
            })

            # r indicates the right most endpoint of the current z boxes that began at or before position k
            r -= 1

            steps.append({
                'l': l,
                'r': r,
                'k': k,
                'z_array': zArray[:]
            })

        # we can reuse previous results
        else:
            # k1 is where the letter was previously matched  
            k1 = k - l

            # zArray[k1] tells us the length of the previously matched string, r-k+1 is the length of the remaining box
            # this basically asks: from k1, does the matched length exceed the right bound  
            if zArray[k1] < r - k + 1:
                # if no, we can just reuse the previously matched result
                zArray[k] = zArray[k1]

                steps.append({
                    'l': l,
                    'r': r,
                    'k': k,
                    'k1': k1,
                    'z_array': zArray[:]
                })
                
            else: 
                # otherwise it's touching the right boundary, check to see if more matches exist
                l = k 

                steps.append({
                    'l': l,
                    'r': r,
                    'k': k,
                    'z_array': zArray[:]
                })

                # start matching from r
                while r < len(str) and str[r] == str[r - l]:

                    steps.append({
                        'l': l,
                        'r': r,
                        'k': k,
                        'comparison': (r, r-l),
                        'match': True,
                        'z_array': zArray[:]
                    })

                    r += 1

                    steps.append({
                        'l': l,
                        'r': r,
                        'k': k,
                        'z_array': zArray[:]
                    })

                zArray[k] = r - l 

                # update z array
                steps.append({
                    'l': l,
                    'r': r,
                    'k': k,
                    'z_array': zArray[:]
                })

                r -= 1

                steps.append({
                    'l': l,
                    'r': r,
                    'k': k,
                    'z_array': zArray[:]
                })
    
    # return only the text part
    return zArray, steps

if __name__ == "__main__":
    text = "abcabcabc"
    pattern = "abca"
    print(z_algorithm(text, pattern))