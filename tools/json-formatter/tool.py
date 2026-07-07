import json

def run(args):
    text = args.get("input", "")
    op = args.get("op", "beautify")
    try:
        parsed = json.loads(text)
        if op == "minify":
            return {"result": json.dumps(parsed, separators=(',', ':'))}
        return {"result": json.dumps(parsed, indent=2)}
    except Exception as e:
        return {"error": str(e)}
