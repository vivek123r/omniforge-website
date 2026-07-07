from omniforge.modules.toolbox.core import compute_hash

def run(args):
    text = args.get("input", "")
    algo = args.get("algorithm", "sha256")
    try:
        return {"result": compute_hash(text.encode("utf-8"), algo)}
    except Exception as e:
        return {"error": str(e)}
