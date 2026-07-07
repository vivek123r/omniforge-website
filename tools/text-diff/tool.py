import difflib

def run(args):
    text1 = args.get("text1", "").splitlines()
    text2 = args.get("text2", "").splitlines()
    try:
        diff = list(difflib.unified_diff(text1, text2, lineterm=""))
        return {"result": "\n".join(diff)}
    except Exception as e:
        return {"error": str(e)}
