# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodePackages.firebase-tools
    pkgs.jdk17
    pkgs.unzip
  ];
  env = {
    MOBILE_PATH = "./mobile";
  };
  idx = {
    extensions = [
      "Dart-Code.flutter"
      "Dart-Code.dart-code"
    ];
    workspace = {
      onCreate = {
        build-flutter = ''
          if [ -d "$MOBILE_PATH" ]; then
            cd "$MOBILE_PATH/android"
            if [ -f "./gradlew" ]; then
              ./gradlew \
                --parallel \
                -Pverbose=true \
                -Ptarget-platform=android-x86 \
                -Ptarget=../lib/main.dart \
                -Pbase-application-name=android.app.Application \
                -Pdart-defines=RkxVVFRFUl9XRUJfQ0FOVkFTS0lUX1VSTD1odHRwczovL3d3dy5nc3RhdGljLmNvbS9mbHV0dGVyLWNhbnZhc2tpdC85NzU1MDkwN2I3MGY0ZjNiMzI4YjZjMTYwMGRmMjFmYWMxYTE4ODlhLw== \
                -Pdart-obfuscation=false \
                -Ptrack-widget-creation=true \
                -Ptree-shake-icons=false \
                -Pfilesystem-scheme=org-dartlang-root \
                assembleDebug
            else
              echo "gradlew file not found in $MOBILE_PATH/android"
            fi
          else
            echo "Mobile directory not found at $MOBILE_PATH"
          fi

          adb -s localhost:5555 wait-for-device
        '';
      };
      
      onStart = {
        cd-to-mobile = ''
          if [ -d "$MOBILE_PATH" ]; then
            cd "$MOBILE_PATH"
            echo "Changed directory to $MOBILE_PATH"
          else
            echo "Mobile directory not found at $MOBILE_PATH"
          fi
        '';
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["sh" "-c" "cd $MOBILE_PATH && flutter run --machine -d web-server --web-hostname 0.0.0.0 --web-port $PORT"];
          manager = "flutter";
        };
        android = {
          command = ["sh" "-c" "cd $MOBILE_PATH && flutter run --machine -d android -d localhost:5555"];
          manager = "flutter";
        };
      };
    };
  };
}