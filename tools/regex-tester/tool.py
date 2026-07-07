import re

def run(args):
    pattern = args.get("pattern", "")
    text = args.get("input", "")
    flags_list = args.get("flags", [])
    
    flags = 0
    if "i" in flags_list:
        flags |= re.IGNORECASE
    if "m" in flags_list:
        flags |= re.MULTILINE
    if "s" in flags_list:
        flags |= re.DOTALL
        
    try:
        regex = re.compile(pattern, flags)
        matches = []
        for m in regex.finditer(text):
            groups = list(m.groups())
            group_dict = m.groupdict()
            matches.append({
                "match": m.group(0),
                "start": m.start(),
                "end": m.end(),
                "groups": groups,
                "groupdict": group_dict
            })
        return {
            "success": True,
            "matches": matches,
            "count": len(matches)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
