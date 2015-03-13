#ifndef NODE_BTSP_SRC_DEVICE_INQ_H
#define NODE_BTSP_SRC_DEVICE_INQ_H

#include <node.h>
#include <uv.h>
#include <nan.h>

class DeviceINQ : public node::ObjectWrap {
    private:
#ifdef _WINDOWS_
        bool initialized;

        bool GetInitializedProperty() {
            return initialized;
        }
#endif

    public:
#ifdef _WINDOWS_
        __declspec(property(get = GetInitializedProperty)) bool Initialized;
#endif

        static void Init(v8::Handle<v8::Object> exports);
        static void EIO_SdpSearch(uv_work_t *req);
        static void EIO_AfterSdpSearch(uv_work_t *req);

    private:
        struct sdp_baton_t {
            DeviceINQ *inquire;
            uv_work_t request;
            NanCallback* cb;
            int channelID;
            char address[40];
        };

        DeviceINQ();
        ~DeviceINQ();

        static NAN_METHOD(New);
        static NAN_METHOD(Inquire);
        static NAN_METHOD(SdpSearch);
        static NAN_METHOD(ListPairedDevices);
};

#endif
