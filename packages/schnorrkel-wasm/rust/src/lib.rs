mod utils;

use wasm_bindgen::prelude::*;

use schnorrkel::{
    self,
    derive::{ChainCode, Derivation, CHAIN_CODE_LENGTH},
    ExpansionMode, Keypair, MiniSecretKey, PublicKey, SecretKey, Signature,
};

const CTX: &[u8] = b"substrate";

#[wasm_bindgen(start, skip_typescript)]
fn init() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub fn sr25519_sign(pubkey: &[u8], secret: &[u8], msg: &[u8]) -> Vec<u8> {
    let pubkey = PublicKey::from_bytes(pubkey).expect("Invalid pubkey");
    let secret = SecretKey::from_ed25519_bytes(secret).expect("Invalid secret");
    secret.sign_simple(CTX, msg, &pubkey).to_bytes().to_vec()
}

#[wasm_bindgen]
pub fn sr25519_verify(pubkey: &[u8], msg: &[u8], signature: &[u8]) -> bool {
    let pubkey = PublicKey::from_bytes(pubkey).expect("Invalid pubkey");
    let sig = Signature::from_bytes(signature).expect("Invalid signature");
    pubkey.verify_simple(CTX, msg, &sig).is_ok()
}

#[wasm_bindgen]
pub fn sr25519_pubkey(secret: &[u8]) -> Vec<u8> {
    // TODO: double check
    SecretKey::from_ed25519_bytes(secret)
        .expect("Invalid secret")
        .to_public()
        .to_bytes()
        .to_vec()
    // let secret = SecretKey::from_bytes(secret).expect("Invalid secret");
    // secret.to_public().to_bytes().to_vec()
}

#[wasm_bindgen]
pub fn sr25519_keypair_from_seed(seed: &[u8]) -> Vec<u8> {
    keypair_from_seed(seed).to_half_ed25519_bytes().to_vec()
}

fn keypair_from_seed(seed: &[u8]) -> Keypair {
    MiniSecretKey::from_bytes(seed)
        .expect("32 bytes can always build a key; qed")
        .expand_to_keypair(ExpansionMode::Ed25519)
}

#[wasm_bindgen]
pub fn sr25519_secret_from_seed(seed: &[u8]) -> Vec<u8> {
    keypair_from_seed(seed).secret.to_ed25519_bytes().to_vec()
}

fn create_cc(data: &[u8]) -> ChainCode {
    let mut cc = [0u8; CHAIN_CODE_LENGTH];
    cc.copy_from_slice(data);
    ChainCode(cc)
}

#[wasm_bindgen]
pub fn sr25519_derive_seed_hard(seed: &[u8], cc: &[u8]) -> Vec<u8> {
    keypair_from_seed(seed)
        .hard_derive_mini_secret_key(Some(create_cc(cc)), [])
        .0
        .to_bytes()
        .to_vec()
}

#[wasm_bindgen]
pub fn sr25519_derive_keypair_hard(keypair: &[u8], cc: &[u8]) -> Vec<u8> {
    Keypair::from_half_ed25519_bytes(keypair)
        .expect("Invalid keypair")
        .hard_derive_mini_secret_key(Some(create_cc(cc)), [])
        .0
        .expand_to_keypair(ExpansionMode::Ed25519)
        .to_half_ed25519_bytes()
        .to_vec()
}

#[wasm_bindgen]
pub fn sr25519_derive_keypair_soft(keypair: &[u8], cc: &[u8]) -> Vec<u8> {
    Keypair::from_half_ed25519_bytes(keypair)
        .expect("Invalid keypair")
        .derived_key_simple(create_cc(cc), [])
        .0
        .to_half_ed25519_bytes()
        .to_vec()
}

#[wasm_bindgen]
pub fn sr25519_derive_public_soft(pubkey: &[u8], cc: &[u8]) -> Vec<u8> {
    PublicKey::from_bytes(pubkey)
        .expect("Invalid pubkey")
        .derived_key_simple(create_cc(cc), [])
        .0
        .to_bytes()
        .to_vec()
}
