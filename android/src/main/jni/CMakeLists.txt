cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB react_codegen_SRCS CONFIGURE_DEPENDS *.cpp react/renderer/components/reactnativekeyboardcontroller/*.cpp)

add_library(
  react_codegen_reactnativekeyboardcontroller
  OBJECT
  ${react_codegen_SRCS}
)

target_include_directories(react_codegen_reactnativekeyboardcontroller PUBLIC . react/renderer/components/reactnativekeyboardcontroller)

target_link_libraries(
  react_codegen_reactnativekeyboardcontroller
  fbjni
  jsi
  # We need to link different libraries based on whether we are building rncore or not, that's necessary
  # because we want to break a circular dependency between react_codegen_rncore and reactnative
  reactnative
)

target_compile_options(
  react_codegen_reactnativekeyboardcontroller
  PRIVATE
  -DLOG_TAG=\"ReactNative\"
  -fexceptions
  -frtti
  -std=c++20
  -Wall
)

target_include_directories(react_codegen_reactnativekeyboardcontroller PUBLIC ../common)
target_include_directories(react_codegen_reactnativekeyboardcontroller PUBLIC ./build/generated/source/codegen/jni)

target_link_libraries(
  react_codegen_reactnativekeyboardcontroller
  fbjni
  jsi
  reactnative
)