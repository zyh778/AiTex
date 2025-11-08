// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// 导入 lib.rs 中的 main 函数
use aitex::run_main;

fn main() {
    run_main();
}