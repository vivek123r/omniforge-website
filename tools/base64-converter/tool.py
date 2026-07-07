from omniforge.modules.toolbox.core import base64_encode_text, base64_decode_text

def run(args):
    op = args.get("op", "encode")
    text = args.get("input", "")
    try:
        if op == "encode":
            return {"result": base64_encode_text(text)}
        return {"result": base64_decode_text(text)}
    except Exception as e:
        return {"error": str(e)}
