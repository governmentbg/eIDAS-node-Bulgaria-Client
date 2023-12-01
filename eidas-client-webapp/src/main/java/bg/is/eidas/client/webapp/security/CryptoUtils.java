package bg.is.eidas.client.webapp.security;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class CryptoUtils {

    private static final String SALT = "&47FsZYz]ZTaL*&";
    private static final Charset CHARSET = StandardCharsets.UTF_8;
    private static final int GCM_TAG_LENGTH = 16;

    private CryptoUtils() {}

    public static String encrypt(String strToEncrypt, String cryptoKey) {
        try {
            Cipher cipher = buildCipher(Cipher.ENCRYPT_MODE, cryptoKey);
            return Base64.getUrlEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to encrypt. Reason: " + e.getMessage(), e);
        }
    }

    public static String decrypt(String strToDecrypt, String cryptoKey) {
        try {
            Cipher cipher = buildCipher(Cipher.DECRYPT_MODE, cryptoKey);
            return new String(cipher.doFinal(Base64.getUrlDecoder().decode(strToDecrypt)));
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to decrypt. Reason: " + e.getMessage(), e);
        }
    }

    public static String encodePassword(CharSequence password) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA-256");
            final byte[] digestedData = digest.digest(toByteArray(password));
            return new String(Base64.getEncoder().encode(digestedData));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalArgumentException("Unable to encode password. Reason: " + exception.getMessage(), exception);
        }
    }

    private static Cipher buildCipher(int encryptMode, String cryptoKey)
            throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
        byte[] iv = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec spec = new PBEKeySpec(cryptoKey.toCharArray(), SALT.getBytes(), 65536, 256);
        SecretKey tmp = factory.generateSecret(spec);
        SecretKeySpec secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec ivSpec = new GCMParameterSpec(GCM_TAG_LENGTH * Byte.SIZE, iv);
        cipher.init(encryptMode, secretKey, ivSpec);
        return cipher;
    }

    private static byte[] toByteArray(CharSequence string) {
        try {
            final ByteBuffer bytes = CHARSET.newEncoder().encode(CharBuffer.wrap(string));
            final byte[] bytesCopy = new byte[bytes.limit()];
            System.arraycopy(bytes.array(), 0, bytesCopy, 0, bytes.limit());

            return bytesCopy;
        } catch (CharacterCodingException e) {
            throw new IllegalArgumentException("Encoding failed", e);
        }
    }
}

