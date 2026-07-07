import base64
import io

def run(args):
    text = args.get("input", "https://omniforge.dev")
    box_size = args.get("box_size", 10)
    border = args.get("border", 4)
    
    try:
        import qrcode
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=box_size,
            border=border,
        )
        qr.add_data(text)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {
            "success": True,
            "data": img_str
        }
    except ImportError:
        # Fallback if qrcode module not pre-installed in user environment
        return {
            "success": False,
            "error": "qrcode module not installed. Please run: pip install qrcode pillow"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
